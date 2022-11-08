import * as React from 'react';
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
      <>
        <Output ref={this.outputRef} />
        <Version />
      </>
    );
  }
}
