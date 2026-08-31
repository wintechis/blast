import React from 'react';
import useBlocklyWorkspace from './useBlocklyWorkspace.ts';

import {currentToolbox} from './toolbox.ts';

function BlocklyWorkspace({
  initialXml = null,
  toolboxConfiguration = currentToolbox,
  workspaceConfiguration = null,
  className = null,
  onWorkspaceChange = null,
  onXmlChange = null,
  onImportXmlError = null,
  onInject = null,
  onDispose = null,
}) {
  const editorDiv = React.useRef(null);
  const {xml} = useBlocklyWorkspace({
    ref: editorDiv,
    initialXml,
    toolboxConfiguration,
    workspaceConfiguration,
    onWorkspaceChange,
    onImportXmlError,
    onInject,
    onDispose,
  });
  const onXmlChangeRef = React.useRef(onXmlChange);
  React.useEffect(() => {
    onXmlChangeRef.current = onXmlChange;
  }, [onXmlChange]);
  React.useEffect(() => {
    if (onXmlChangeRef.current && xml) {
      onXmlChangeRef.current(xml);
    }
  }, [xml]);

  return <div className={className} ref={editorDiv} />;
}

export default BlocklyWorkspace;
