import * as React from 'react';
import {Paper} from '@mui/material';
import Output from './Output.jsx';
import Version from './Version.jsx';

export default class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
    };
    this.outputRef = React.createRef();
  }

  componentDidMount() {
    globalThis['addMessage'] = this.outputRef.current.addMessage;
  }

  render() {
    return (
      <Paper sx={{p: 1, boxSizing: 'content-box'}}>
        <Output ref={this.outputRef} />
        <Version />
      </Paper>
    );
  }
}
