import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import {setThingsLog} from '../assets/js/things.js';

let logId = 0;

const logCss = {
  'font-family': 'monospace',
  'line-height': '16px',
  margin: '2px',
};

const logTimeClass = {
  'white-space': 'nowrap',
  color: 'gray',
};

const logIdentifierClass = {
  'font-size': '12px',
  border: '1px solid',
  'border-radius': '2px',
  'font-weight': 'bold',
  height: '16px',
  'margin-inline-end': '5px',
  'margin-top': '2px',
  padding: '0 2px 0 2px',
  'white-space': 'nowrap',
  ...logCss,
};

const logAdapterClass = {
  width: '72px',
  ...logIdentifierClass,
};

const logMessageCodeClass = {
  'font-family':
    'ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace',
  padding: '0.2em 0.4em',
  margin: 0,
  'font-size': '85%',
  'background-color': 'rgb(175 184 193 / 20%)',
  'border-radius': '6px',
};

export default class DeviceLogTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
    };
  }

  componentDidMount() {
    setThingsLog((msg, adapter, device) => {
      const rows = this.state.rows;
      rows.push({
        id: logId++,
        adapter: adapter,
        identifier: device,
        time: new Date().toLocaleTimeString(),
        message: msg,
      });
      this.setState({rows: rows});
    });
  }

  getAdapterColor(adapter) {
    switch (adapter.toLowerCase()) {
      case 'bluetooth':
        return 'blue';
      case 'hid':
        return 'blueviolet';
      case 'eddystone':
        return 'cyan';
      default:
        return 'black';
    }
  }

  createListItem = (id, adapter, identifier, time, message) => {
    const logAdapter = (
      <Box
        key={logId + '-adapter'}
        component="span"
        sx={logAdapterClass}
        style={{color: this.getAdapterColor(adapter)}}
      >
        {adapter}
      </Box>
    );
    const logIdentifier = identifier ? (
      <Box
        key={logId + '-identifier'}
        component="span"
        sx={logIdentifierClass}
        style={{color: 'black'}}
      >
        {identifier}
      </Box>
    ) : null;
    const logTime = (
      <Box key={logId + '-time'} component="span" sx={logTimeClass}>
        {'[' + time + ']'}
      </Box>
    );
    const codeRegex = /<code>(.*?)<\/code>/g;
    const codeMatches = message.match(codeRegex);
    const logMessage = (
      <Box
        key={logId + '-msg'}
        component="span"
        sx={logCss}
        style={{color: 'black'}}
      >
        {codeMatches
          ? message.split(codeRegex).map((part, i) => {
              if (i % 2 === 0) {
                return part;
              } else {
                return (
                  <Box
                    key={logId + '-code-' + i}
                    component="code"
                    sx={logMessageCodeClass}
                  >
                    {part}
                  </Box>
                );
              }
            })
          : message}
      </Box>
    );
    return (
      <ListItem key={id} disablePadding>
        <ListItemButton>
          {logAdapter}
          {logIdentifier}
          {logTime}
          {logMessage}
        </ListItemButton>
      </ListItem>
    );
  };

  render() {
    return (
      <List dense>
        {this.state.rows.map(row =>
          this.createListItem(
            row.id,
            row.adapter,
            row.identifier,
            row.time,
            row.message
          )
        )}
      </List>
    );
  }
}
