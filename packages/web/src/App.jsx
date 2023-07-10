import * as React from 'react';
import {utils, Xml} from 'blockly';
import PropTypes from 'prop-types';
import './App.css';
import {TabContext, TabList, useTabContext} from '@mui/lab';
import {
  Backdrop,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Tab,
} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import SyntaxHighlighter from 'react-syntax-highlighter';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {BlocklyWorkspace} from './BlocklyWorkspace';
import BlastBar from './toolbar/Toolbar.jsx';
import ConnectDialog from './ConnectDialog.jsx';
import Controls from './Controls.jsx';
import DeviceLogTab from './tabs/DeviceLogTab.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import JavascriptTab from './tabs/JavascriptTab.jsx';
import PseudoCodeTab from './tabs/PseudoCodeTab.jsx';

import './assets/js/things/index.js';

import {getLatestCode, onStatusChange} from './assets/js/interpreter.ts';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#179c7d',
    },
    secondary: {
      main: '#9C1736',
    },
  },
});

function TabPanel(props) {
  const {children, className, style, value: id, ...other} = props;

  // Prop type validation

  const context = useTabContext();

  if (context === null) {
    throw new TypeError('No TabContext provided');
  }
  const tabId = context.value;

  return (
    <Paper
      className={className}
      style={{
        margin: 0,
        padding: 0,
        display: 'flex',
        position: 'absolute',
        left: 24,
        top: 112,
        height: 'calc(100vh - 112px)',
        width: 'calc((100vw - 48px) * 9/12)',
        visibility: id === tabId ? 'visible' : 'hidden',
        overflow: 'auto',
        ...style,
      }}
      {...other}
    >
      {children}
    </Paper>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.string,
};

export default function App() {
  const [code, setCode] = React.useState('');
  const [tabId, setTabId] = React.useState('workspace');
  const [xml, setXml] = React.useState('');
  const [running, setRunning] = React.useState(false);
  const [workspace, setWorkspace] = React.useState(null);
  const blastBarRef = React.createRef();
  const handleChange = (event, id) => setTabId(id);

  onStatusChange.running.push(() => {
    setRunning(true);
  });
  onStatusChange.stopped.push(() => {
    setRunning(false);
  });
  onStatusChange.error.push(() => {
    setRunning(false);
  });
  onStatusChange.ready.push(() => {
    setRunning(false);
  });

  const updateTabs = workspace => {
    const latestCode = getLatestCode();
    setCode(latestCode);
    setWorkspace(workspace);
  };

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <ConnectDialog blastBarRef={blastBarRef} />
        <BlastBar ref={blastBarRef} />
        <Container maxWidth={false} sx={{height: '100vh', pt: '64px'}}>
          <Paper sx={{height: '100%'}}>
            <Grid container sx={{height: '100%'}} spacing={0}>
              <Grid item xs={9}>
                <TabContext value={tabId}>
                  <TabList value={tabId} onChange={handleChange}>
                    <Tab value="workspace" label="Workspace" />
                    <Tab value="javascript" label="JavaScript" />
                    <Tab value="pseudo" label="Pseudo Code" />
                    <Tab value="xml" label="XML" />
                    <Tab value="log" label="Device Log" />
                  </TabList>
                  <TabPanel value="workspace">
                    <Paper>
                      {running && (
                        <Backdrop
                          open={running}
                          className="blocklyDiv"
                          sx={{
                            zIndex: 99999,
                            top: '112px',
                            left: '24px',
                            backgroundColor: 'rgba(0,0,0,0.1)',
                          }}
                        >
                          Workspace is disabled while running...
                        </Backdrop>
                      )}
                      <ErrorBoundary>
                        <BlocklyWorkspace
                          className="blocklyDiv"
                          onInject={setWorkspace}
                          onWorkspaceChange={updateTabs}
                          onXmlChange={setXml}
                        />
                      </ErrorBoundary>
                    </Paper>
                  </TabPanel>
                  <TabPanel value="javascript">
                    <JavascriptTab code={code} />
                  </TabPanel>
                  <TabPanel value="pseudo">
                    <PseudoCodeTab workspace={workspace} />
                  </TabPanel>
                  <TabPanel value="xml">
                    <SyntaxHighlighter
                      language="xml"
                      showLineNumbers={true}
                      customStyle={{margin: 0, width: '100%'}}
                    >
                      {xml !== '' &&
                        Xml.domToPrettyText(utils.xml.textToDom(xml))}
                    </SyntaxHighlighter>
                  </TabPanel>
                  <TabPanel value="log">
                    <DeviceLogTab />
                  </TabPanel>
                </TabContext>
              </Grid>
              <Grid item xs={3} sx={{height: '100%', zIndex: 500}}>
                <ErrorBoundary>
                  <Controls />
                </ErrorBoundary>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
}
