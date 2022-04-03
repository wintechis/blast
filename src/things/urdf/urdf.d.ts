/**
 * @fileoverview provides type declarations for methods used by the URDF service.
 */

declare module 'urdf' {
  /**
   * Loads the input definitions in the µRDF store.
   *
   * @param {object | array | string} data some JSON-LD definition(s)
   * or some RDF triples serialialized as a string
   * @param {object} opts options as an object (passed to N3.js)
   */
  export async function load(data: any, opts: any): Promise<void>;

  /**
   * Loads the remote JSON-LD or RDF definition in the µRDF store, in its own
   * named graph.
   *
   * @param {string} uri a dereferenceable URI
   */
  export async function loadFrom(uri: string): Promise<void>;

  /**
   * Provides a Promise-based wrapper for core clear function.
   *
   * @param {string} gid a graph identifier (an IRI)
   */
  export function clear(gid?: string): Promise<void>;

  /**
   * Processes the input query and returns mappings as SPARQL JSON or a JSON-LD graph.
   *
   * @param {string} sparql a SPARQL query as string
   */
  export async function query(sparql: string): Promise<any>;
}
