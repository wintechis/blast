import React from 'react';

import {styled} from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {
  resetInterpreter,
  setStatus,
  setStdInfo,
  setStdWarn,
} from './assets/js/interpreter.ts';

const OutputTab = styled(props => (
  <Tab disableFocusRipple disableRipple {...props} />
))(() => ({
  opacity: 1,
  color: 'rgba(0,0,0,0.6)',
  '&:hover': {
    cursor: 'default',
  },
}));

export default class Output extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    // overwrite console.log
    const oldLog = console.log;
    console.log = (msg, type) => {
      oldLog(msg);
      this.setState(state => {
        if (typeof msg === 'undefined') {
          return;
        }
        return {
          messages: state.messages.concat({
            text: msg.toString(),
            time: new Date().toLocaleTimeString(),
            type: type ?? 'text',
          }),
        };
      });
    };
    // overwrite console.error
    const oldError = console.error;
    console.error = msg => {
      const args = Array.from(arguments);
      oldError.apply(console, args);
      globalThis['interpreterExecutionExit'] = true;
      resetInterpreter();
      setStatus('error');
      this.setState(state => {
        return {
          messages: state.messages.concat({
            text: msg.toString(),
            time: new Date().toLocaleTimeString(),
            type: 'error',
          }),
        };
      });
    };
    setStdInfo(msg => {
      this.setState(state => {
        return {
          messages: state.messages.concat({
            text: msg,
            time: new Date().toLocaleTimeString(),
            type: 'info',
          }),
        };
      });
    });
    setStdWarn(msg => {
      this.setState(state => {
        return {
          messages: state.messages.concat({
            text: msg,
            time: new Date().toLocaleTimeString(),
            type: 'warning',
          }),
        };
      });
    });
  }

  componentDidUpdate() {
    const container = document.getElementById('outputContainer');
    container.scrollTop = container.scrollHeight;
  }

  renderMessages() {
    return this.state.messages.map((msg, i) => {
      if (msg.type === 'text') {
        return (
          <Paper
            key={i}
            sx={{display: 'block', backgroundColor: '#E7EBF0', m: 1, p: 1}}
          >
            <Typography sx={{ml: 1}}>{msg.text}</Typography>
            <Typography
              sx={{color: 'text.secondary', fontSize: '0.8rem'}}
              align="right"
            >
              {msg.time}
            </Typography>
          </Paper>
        );
      }
      if (['error', 'info', 'warning'].includes(msg.type)) {
        return (
          <Alert key={i} severity={msg.type} sx={{m: 1}}>
            {msg.text}
          </Alert>
        );
      } else if (msg.type === 'table') {
        return (
          <TableContainer key={i} component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                {msg.text.map((row, j) => (
                  <TableRow key={i - j}>
                    {row.map((cell, k) => (
                      <TableCell key={i - j - k}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      } else if (msg.type === 'image') {
        return (
          <Paper key={i} sx={{m: 1, width: '100%'}}>
            <img src={msg.text} />
          </Paper>
        );
      }
    });
  }

  render() {
    return (
      <>
        <OutputTab label="Output" />
        <Paper>
          <Box
            id="outputContainer"
            sx={{height: 'calc(100vh - 200px)', overflow: 'auto'}}
          >
            {this.renderMessages()}
          </Box>
        </Paper>
      </>
    );
  }
}
