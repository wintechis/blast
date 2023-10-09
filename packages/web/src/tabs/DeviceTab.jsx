import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {setThingsLog} from '../ThingsStore/things.ts';
import {thingsStore} from '../ThingsStore/ThingsStore.ts';
import {
  connect,
  connectedBluetoothDevices,
  pingDevice,
} from '../ThingsStore/webBluetoothDevices.ts';
import {connectedHidDevices} from '../ThingsStore/hidDevices.ts';
import {connectedGamepads} from '../ThingsStore/gamepadDevices.ts';
import {connectedMediaDevices} from '../ThingsStore/MediaDevices.ts';

let logId = 0;

const logCss = {
  fontFamily: 'monospace',
  lineHeight: '16px',
  margin: '2px',
};

const logTimeClass = {
  whiteSpace: 'nowrap',
  color: 'gray',
};

const logIdentifierClass = {
  fontSize: '12px',
  border: '1px solid',
  borderRadius: '2px',
  fontWeight: 'bold',
  height: '16px',
  marginInlineEnd: '5px',
  marginTop: '2px',
  padding: '0 2px 0 2px',
  whiteSpace: 'nowrap',
  ...logCss,
};

const logAdapterClass = {
  width: 'auto',
  ...logIdentifierClass,
};

const logMessageCodeClass = {
  fontFamily:
    'ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace',
  padding: '0.2em 0.4em',
  margin: 0,
  fontSize: '85%',
  backgroundColor: 'rgb(175 184 193 / 20%)',
  borderRadius: '6px',
};

class DeviceTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      connectedThings: new Map(),
      connectingBluetooth: false,
    };
    this.listRef = React.createRef();
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
    this.unsubscribe = thingsStore.subscribe(() => {
      const connectedThings = new Map();
      thingsStore.getState().connectedThings.forEach(thing => {
        if (thing.connectedThing) {
          connectedThings.set(thing.id, thing.connectedThing);
        }
      });
      this.setState({connectedThings: connectedThings});
    });
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    // Unsubscribe from the thingsStore
    this.unsubscribe();
  }

  scrollToBottom() {
    const list = this.listRef.current;
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }

  getAdapterColor(adapter) {
    switch (adapter.toLowerCase()) {
      case 'bluetooth':
        return 'blue';
      case 'hid':
        return 'blueviolet';
      case 'gamepad':
        return 'green';
      case 'audiooutput':
        return 'orange';
      case 'videoinput':
        return 'red';
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
          {logTime}
          {logAdapter}
          {logIdentifier}
          {logMessage}
        </ListItemButton>
      </ListItem>
    );
  };

  render() {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{height: '50%', padding: '25px', overflow: 'auto'}}>
          <Typography variant="h6">Connected Devices</Typography>
          <TableContainer component={Paper}>
            <Table
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                overflow: 'auto',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Thing</TableCell>
                  <TableCell>Adapter</TableCell>
                  <TableCell>Internal ID</TableCell>
                  <TableCell>Connected</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(this.state.connectedThings &&
                  // eslint-disable-next-line react/prop-types
                  Array.from(this.state.connectedThings.keys()).map(key => {
                    // eslint-disable-next-line react/prop-types
                    const thing = this.state.connectedThings.get(key);
                    if (thing?.type === 'bluetooth') {
                      const device = connectedBluetoothDevices.get(key);
                      return (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{thing.type}</TableCell>
                          <TableCell>{device.id}</TableCell>
                          <TableCell>
                            {device.gatt.connected ? 'yes' : 'no'}
                          </TableCell>
                          <TableCell>
                            <LoadingButton
                              size="small"
                              loading={this.state.connectingBluetooth}
                              onClick={() => {
                                this.setState({connectingBluetooth: true});
                                pingDevice(device.id).then(() => {
                                  this.setState({connectingBluetooth: false});
                                });
                              }}
                            >
                              refresh
                            </LoadingButton>
                            <LoadingButton
                              size="small"
                              loading={this.state.connectingBluetooth}
                              onClick={() => {
                                this.setState({connectingBluetooth: true});
                                connect(device.id).then(() => {
                                  this.setState({connectingBluetooth: false});
                                });
                              }}
                            >
                              reconnect
                            </LoadingButton>
                          </TableCell>
                        </TableRow>
                      );
                    } else if (thing.type === 'hid') {
                      const device = connectedHidDevices.get(key);
                      return (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{thing.type}</TableCell>
                          <TableCell>{device.id}</TableCell>
                          <TableCell>{device.opened ? 'yes' : 'no'}</TableCell>
                        </TableRow>
                      );
                    } else if (thing.type === 'gamepad') {
                      const device = connectedGamepads.get(key);
                      return (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{thing.type}</TableCell>
                          <TableCell>{device.index}</TableCell>
                          <TableCell>
                            {device.connected ? 'yes' : 'no'}
                          </TableCell>
                        </TableRow>
                      );
                    } else if (
                      thing.type === 'audiooutput' ||
                      thing.type === 'videoinput'
                    ) {
                      const device = connectedMediaDevices.get(key);
                      return (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{thing.type}</TableCell>
                          <TableCell>{device.deviceId}</TableCell>
                        </TableRow>
                      );
                    }
                  })) || (
                  <TableRow>
                    <TableCell colSpan={4}>
                      no bluetooth devices connected
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{height: '50%', padding: '25px', overflow: 'none'}}>
          <List
            ref={this.listRef}
            sx={{
              height: '100%',
              width: '100%',
              bgcolor: 'background.paper',
              overflow: 'auto',
            }}
          >
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
        </Box>
      </Box>
    );
  }
}

export default DeviceTab;
