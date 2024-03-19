import React from 'react';
import {
  ContextMenu,
  ContextMenuRegistry,
  getMainWorkspace,
  inject,
  utils,
  WorkspaceSvg,
  Xml,
} from 'blockly';
import {UseBlocklyProps} from './BlocklyWorkspaceProps';

import debounce from './debounce';

import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {downloadScreenshot} from '../assets/js/screenshot.js';

import {initInterpreter} from '../assets/js/interpreter';
import {statesFlyoutCategory} from '../assets/js/states.js';
import {thingsFlyoutCategory} from '../ThingsStore/things';

JavaScript.addReservedWords('highlightBlock');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any)['highlightBlock'] = function (id: string) {
  (getMainWorkspace() as WorkspaceSvg).highlightBlock(id);
};

export function importFromXml(
  xml: Element,
  workspace: WorkspaceSvg,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportXmlError: (e: any) => void
) {
  try {
    Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
    return true;
  } catch (e) {
    if (onImportXmlError) {
      onImportXmlError(e);
    }
    return false;
  }
}

const useBlocklyWorkspace = ({
  ref,
  initialXml,
  toolboxConfiguration,
  workspaceConfiguration,
  onWorkspaceChange,
  onImportXmlError,
  onInject,
  onDispose,
}: UseBlocklyProps): {
  workspace: WorkspaceSvg | undefined;
  xml: string | null;
} => {
  const [workspace, setWorkspace] = React.useState<WorkspaceSvg | null>();
  const [xml, setXml] = React.useState<string | null>(initialXml);
  const [didInitialImport, setDidInitialImport] = React.useState(false);
  const [didHandleNewWorkspace, setDidHandleNewWorkspace] =
    React.useState(false);

  // we explicitly don't want to recreate the workspace when the configuration changes
  // so, we'll keep it in a ref and update as necessary in an effect hook
  const workspaceConfigurationRef = React.useRef(workspaceConfiguration);
  React.useEffect(() => {
    workspaceConfigurationRef.current = workspaceConfiguration;
  }, [workspaceConfiguration]);

  const toolboxConfigurationRef = React.useRef(toolboxConfiguration);
  React.useEffect(() => {
    toolboxConfigurationRef.current = toolboxConfiguration;
    if (toolboxConfiguration && workspace) {
      workspace.updateToolbox(toolboxConfiguration);
    }
  }, [toolboxConfiguration, workspace]);

  const onInjectRef = React.useRef(onInject);
  const onDisposeRef = React.useRef(onDispose);
  React.useEffect(() => {
    onInjectRef.current = onInject;
  }, [onInject]);
  React.useEffect(() => {
    onDisposeRef.current = onDispose;
  }, [onDispose]);

  const handleWorkspaceChanged = React.useCallback(
    (newWorkspace: WorkspaceSvg) => {
      if (onWorkspaceChange) {
        onWorkspaceChange(newWorkspace);
      }
    },
    [onWorkspaceChange]
  );

  // Workspace creation
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    const newWorkspace = inject(ref.current, {
      ...workspaceConfigurationRef.current,
      comments: true,
      collapse: true,
      disable: true,
      grid: {
        spacing: 25,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      horizontalLayout: false,
      maxBlocks: Infinity,
      maxInstances: {test_basic_limit_instances: 3},
      maxTrashcanContents: 256,
      toolbox: toolboxConfigurationRef.current,
      media: 'assets/media/',
      toolboxPosition: 'start',
      renderer: 'geras',
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 4,
        minScale: 0.25,
        scaleSpeed: 1.1,
      },
    });
    newWorkspace.configureContextMenu = configureContextMenu;

    /**
     * Adds 'download screenshot' and 'add comment' to the context menu.
     * @param {!ContextMenuRegistry.ContextMenuOption} menuOptions the context menu options.
     * @param {!Event} e The right-click mouse event.
     */
    function configureContextMenu(
      menuOptions: ContextMenuRegistry.ContextMenuOption[],
      e: Event
    ) {
      const screenshotOption = {
        text: 'Download Screenshot',
        enabled: newWorkspace.getTopBlocks(false).length > 0,
        callback: function () {
          downloadScreenshot(newWorkspace);
        },
        scope: {workspace: newWorkspace},
        weight: 100,
      };
      menuOptions.push(screenshotOption);

      // // Adds a default-sized workspace comment to the workspace.
      menuOptions.push(ContextMenu.workspaceCommentOption(newWorkspace, e));
    }
    initInterpreter(newWorkspace);

    // register things category flyout callback
    newWorkspace.registerToolboxCategoryCallback(
      'THINGS',
      thingsFlyoutCategory
    );
    // register event category flyout callback
    newWorkspace.registerToolboxCategoryCallback(
      'STATES',
      statesFlyoutCategory
    );

    setWorkspace(newWorkspace);
    setDidInitialImport(false); // force a re-import if we recreate the workspace
    setDidHandleNewWorkspace(false); // Signal that a workspace change event needs to be sent.

    if (onInjectRef.current) {
      onInjectRef.current(newWorkspace);
    }

    const onDisposeFunction = onDisposeRef.current;

    // Dispose of the workspace when our div ref goes away (Equivalent to didComponentUnmount)
    return () => {
      newWorkspace.dispose();

      if (onDisposeFunction) {
        onDisposeFunction(newWorkspace);
      }
    };
  }, [ref]);

  // Send a workspace change event when the workspace is created
  React.useEffect(() => {
    if (workspace && !didHandleNewWorkspace) {
      handleWorkspaceChanged(workspace);
    }
  }, [handleWorkspaceChanged, didHandleNewWorkspace, workspace]);

  // Workspace change listener
  React.useEffect(() => {
    if (!workspace) {
      return undefined;
    }

    const listener = () => {
      handleWorkspaceChanged(workspace);
    };
    workspace.addChangeListener(listener);
    return () => {
      workspace.removeChangeListener(listener);
    };
  }, [workspace, handleWorkspaceChanged]);

  // xmlDidChange callback
  React.useEffect(() => {
    if (!workspace) {
      return undefined;
    }

    const [callback, cancel] = debounce(() => {
      const newXml = Xml.domToText(Xml.workspaceToDom(workspace));
      if (newXml === xml) {
        return;
      }

      setXml(newXml);
    }, 200);

    workspace.addChangeListener(callback);

    return () => {
      workspace.removeChangeListener(callback);
      cancel();
    };
  }, [workspace, xml]);

  // Initial Xml Changes
  React.useEffect(() => {
    if (xml && workspace && !didInitialImport) {
      const success = importFromXml(
        utils.xml.textToDom(xml),
        workspace,
        onImportXmlError
      );
      if (!success) {
        setXml(null);
      }
      setDidInitialImport(true);
    }
  }, [xml, workspace, didInitialImport, onImportXmlError]);

  if (workspace) {
    return {workspace, xml};
  } else {
    return {workspace: undefined, xml: null};
  }
};

export default useBlocklyWorkspace;
