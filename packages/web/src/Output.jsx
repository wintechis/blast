import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {
  setStdOut,
  setStdError,
  setStdIn,
  setStdInfo,
  setStdWarn,
} from './assets/js/interpreter.js';

export default class Output extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.addMessage = this.addMessage.bind(this);
  }

  componentDidMount() {
    setStdOut((msg, type) => {
      this.addMessage(msg, type);
    });
    setStdError(msg => {
      console.error(msg);
      this.setState(state => {
        return {
          messages: state.messages.concat({
            text: msg.toString(),
            time: new Date().toLocaleTimeString(),
            type: 'error',
          }),
        };
      });
    });
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
    setStdIn(async message => {
      return prompt(message);
    });
  }

  componentDidUpdate() {
    const container = document.getElementById('outputContainer');
    container.scrollTop = container.scrollHeight;
  }

  addMessage(text, type) {
    this.setState(state => {
      return {
        messages: state.messages.concat({
          text: text,
          type: type,
          time: new Date().toLocaleTimeString(),
        }),
      };
    });
  }

  renderMessages() {
    return this.state.messages.map((msg, i) => {
      if (typeof msg.type !== 'undefined') {
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
      } else {
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
    });
  }

  render() {
    return (
      <>
        <Typography variant="h4">Output</Typography>
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
