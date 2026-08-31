/**
 * @fileoverview A small cooperative scheduler that drives BLAST's event-driven
 * programs. It replaces the hand-rolled `while (true)` busy-poll loops that were
 * previously emitted per state definition.
 *
 * State conditions are re-evaluated in two complementary ways:
 *  - Push: when a state condition reads a workspace variable, the scheduler is
 *    told which variables it depends on. Whenever generated code writes one of
 *    those variables (through the instrumented `variables_set` / `math_change`
 *    generators), {@link Scheduler.notifyVariable} re-evaluates exactly the
 *    states that depend on it — immediately, with no polling latency.
 *  - Poll fallback: a single shared timer still evaluates every state on an
 *    interval. This catches value changes that don't flow through an
 *    instrumented variable write — loop counters, variables assigned directly
 *    inside device event handlers, and live (non-observable) WoT property reads.
 *    Because those paths exist, polling cannot be removed without risking a
 *    silently missed edge; the push path lowers latency and CPU pressure but the
 *    poll remains the correctness backstop.
 *
 * Other responsibilities:
 *  - Interval sources: `every_seconds` blocks register here instead of calling
 *    `setInterval` directly, so the scheduler is the single source of truth for
 *    "is anything still running?".
 *  - Teardown: {@link Scheduler.stop} cancels every timer and clears all state,
 *    so stopping the interpreter actually tears the loops down (the old promise
 *    loops kept spinning until the page was reloaded).
 *
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * A registered state source: an async condition plus the callbacks to run when
 * the condition's value rises (enters) or falls (exits).
 */
interface StateSource {
  /** Evaluates the (possibly async) state condition to a boolean-ish value. */
  condition: () => unknown | Promise<unknown>;
  /** Invoked on a false -> true transition. */
  onEnter: () => void;
  /** Invoked on a true -> false transition. */
  onExit: () => void;
  /** Names of the workspace variables this condition reads. */
  variables: string[];
  /** Previous evaluation, used for edge detection. */
  prev: boolean;
  /**
   * Set while an evaluation is in flight, so a poll tick and a variable
   * notification can never evaluate the same state concurrently and dispatch an
   * edge twice.
   */
  evaluating: boolean;
}

/**
 * Handler invoked when a state condition, enter/exit callback or interval
 * callback throws. Defaults to {@link console.error}; wired to the
 * interpreter's warning output in {@link ./interpreter}.
 */
type ErrorHandler = (message: string) => void;

class Scheduler {
  /** Registered state sources, keyed by their originating block id. */
  private states = new Map<string, StateSource>();

  /** Index from variable name to the ids of states that read it. */
  private variableIndex = new Map<string, Set<string>>();

  /** Active interval timer ids from `every_seconds` blocks. */
  private intervals = new Set<ReturnType<typeof setInterval>>();

  /** The single shared timer that polls all state conditions. */
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  /** Guards against overlapping poll passes when a condition is slow. */
  private ticking = false;

  /** How often, in milliseconds, state conditions are polled. */
  private pollIntervalMs = 100;

  private errorHandler: ErrorHandler = console.error;

  /**
   * Sets how often state conditions are polled. Takes effect on the next run.
   */
  setPollInterval(ms: number): void {
    this.pollIntervalMs = Math.max(0, ms);
  }

  /**
   * Sets the handler invoked when user code registered with the scheduler
   * throws.
   */
  setErrorHandler(handler: ErrorHandler): void {
    this.errorHandler = handler;
  }

  /**
   * Reports an error thrown by a condition or callback without tearing the
   * whole program down.
   */
  reportError(error: unknown): void {
    const message =
      error instanceof Error ? (error.stack ?? error.message) : String(error);
    this.errorHandler(message);
  }

  /**
   * Registers a state source and, if necessary, starts the shared poll timer.
   *
   * @param variables Names of the workspace variables the condition reads, used
   *   to route variable-write notifications straight to this state.
   */
  addState(
    id: string,
    condition: () => unknown | Promise<unknown>,
    onEnter: () => void,
    onExit: () => void,
    variables: string[] = []
  ): void {
    this.states.set(id, {
      condition,
      onEnter,
      onExit,
      variables,
      prev: false,
      evaluating: false,
    });
    for (const name of variables) {
      let ids = this.variableIndex.get(name);
      if (!ids) {
        ids = new Set();
        this.variableIndex.set(name, ids);
      }
      ids.add(id);
    }
    this.startPolling();
  }

  /**
   * Re-evaluates every state that depends on the named variable. Called from
   * generated code immediately after that variable is written, so conditions
   * react without waiting for the next poll tick.
   */
  async notifyVariable(name: string): Promise<void> {
    const ids = this.variableIndex.get(name);
    if (!ids) {
      return;
    }
    await Promise.all(
      [...ids].map(id => {
        const state = this.states.get(id);
        return state ? this.evaluateState(state) : undefined;
      })
    );
  }

  /**
   * Registers an interval source (used by `every_seconds`) and returns its
   * timer id.
   */
  addInterval(
    callback: () => void | Promise<void>,
    ms: number
  ): ReturnType<typeof setInterval> {
    const id = setInterval(async () => {
      try {
        await callback();
      } catch (error) {
        this.reportError(error);
      }
    }, ms);
    this.intervals.add(id);
    return id;
  }

  /**
   * Returns true while at least one state or interval source is registered,
   * i.e. while the program should be kept alive.
   */
  hasLiveSources(): boolean {
    return this.states.size > 0 || this.intervals.size > 0;
  }

  /**
   * Cancels every timer and clears all registered sources. Called when the
   * interpreter is stopped or reset.
   */
  stop(): void {
    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    for (const id of this.intervals) {
      clearInterval(id);
    }
    this.intervals.clear();
    this.states.clear();
    this.variableIndex.clear();
    this.ticking = false;
  }

  /**
   * Lazily starts the shared poll timer when the first state is registered.
   */
  private startPolling(): void {
    if (this.pollTimer !== null || this.states.size === 0) {
      return;
    }
    this.pollTimer = setInterval(() => this.tick(), this.pollIntervalMs);
  }

  /**
   * Poll pass: evaluates all state conditions once. Conditions are evaluated in
   * parallel so a slow one does not delay the others, and a re-entrancy guard
   * skips ticks that overlap a slow evaluation.
   */
  private async tick(): Promise<void> {
    if (this.ticking) {
      return;
    }
    this.ticking = true;
    try {
      await Promise.all(
        [...this.states.values()].map(state => this.evaluateState(state))
      );
    } finally {
      this.ticking = false;
    }
  }

  /**
   * Evaluates a single state condition and dispatches its enter/exit callback on
   * an edge. Safe to call from both the poll timer and variable notifications:
   * the per-state `evaluating` guard prevents a concurrent double-dispatch, and
   * errors are reported rather than thrown.
   */
  private async evaluateState(state: StateSource): Promise<void> {
    if (state.evaluating) {
      return;
    }
    state.evaluating = true;
    try {
      let value: boolean;
      try {
        value = Boolean(await state.condition());
      } catch (error) {
        this.reportError(error);
        return;
      }
      try {
        if (!state.prev && value) {
          state.onEnter();
        } else if (state.prev && !value) {
          state.onExit();
        }
      } catch (error) {
        this.reportError(error);
      }
      state.prev = value;
    } finally {
      state.evaluating = false;
    }
  }
}

/**
 * The single scheduler instance shared by the interpreter and all generated
 * code.
 */
export const scheduler = new Scheduler();

// Generated programs reference the scheduler through this global (they run
// inside an `AsyncFunction` and only have access to globals). Reserve the name
// so user variables can never shadow it.
JavaScript.addReservedWords('blastScheduler');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any)['blastScheduler'] = scheduler;
