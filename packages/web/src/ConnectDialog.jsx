import React from 'react';
import propTypes from 'prop-types';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import AddIcon from '@mui/icons-material/Add';

import {
  addDevice,
  connectWebHidDevice,
  implementedThings,
  setAudioSelectButtonHandler,
  setVideoSelectButtonHandler,
  setWebBluetoothButtonHandler,
  setWebHidButtonHandler,
} from './assets/js/things.js';

import {getStdWarn} from './assets/js/interpreter.js';
import {requestDevice} from './assets/js/webBluetooth.js';

export default class ConnectDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onclose: null,
      open: false,
      selectedAdapter: 'bluetooth',
      videoAudioDevices: null,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  static propTypes = {
    blastBarRef: propTypes.object.isRequired,
    onclose: propTypes.func,
    open: propTypes.bool,
  };

  componentDidMount() {
    setAudioSelectButtonHandler(() => {
      this.setState({open: true, selectedAdapter: 'audiooutput'});
      console.log(this.state);
    });
    setVideoSelectButtonHandler(() => {
      this.setState({open: true, selectedAdapter: 'videoinput'});
    });
    setWebBluetoothButtonHandler(() => {
      this.setState({open: true, selectedAdapter: 'bluetooth'});
    });
    setWebHidButtonHandler(() => {
      this.setState({open: true, selectedAdapter: 'hid'});
    });
    this.getDevices();
  }

  async getDevices() {
    await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.setState({videoAudioDevices: devices});
  }

  handleClose() {
    this.setState({open: false});
  }

  render() {
    return (
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <DialogTitle>Please select a device from the list below</DialogTitle>
        <List dense>
          {((this.state.selectedAdapter === 'bluetooth' ||
            this.state.selectedAdapter === 'hid') &&
            implementedThings.map(thing => {
              if (thing.type === this.state.selectedAdapter) {
                return (
                  <ListItem key={thing.name}>
                    <ListItemButton
                      onClick={async () => {
                        if (this.state.selectedAdapter === 'bluetooth') {
                          const stdWarn = getStdWarn();
                          const isChrome = !!window.chrome;
                          const supportsWebBluetooth = 'bluetooth' in navigator;

                          if (!isChrome) {
                            stdWarn(
                              'Blocks using Bluetooth are supported in Chrome only.'
                            );
                            this.handleClose();
                          }
                          if (isChrome && !supportsWebBluetooth) {
                            stdWarn(
                              'Experimental Web Bluetooth support is required in order to use Bluetooth devices. ' +
                                'Enable it in chrome://flags/#enable-experimental-web-platform-features'
                            );
                            this.handleClose();
                          }

                          await requestDevice(thing);
                          if (thing.id === 'spheroMini') {
                            this.props.blastBarRef.current.setSpheroConnected(
                              true
                            );
                          }
                          this.handleClose();
                        } else if (this.state.selectedAdapter === 'hid') {
                          await connectWebHidDevice(thing);
                          this.handleClose();
                        }
                      }}
                    >
                      {thing.name}
                      <Box sx={{flexGrow: 1}} />
                      <IconButton edge="end" aria-label="connect">
                        <AddIcon />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>
                );
              }
            })) ||
            ((this.state.selectedAdapter === 'videoinput' ||
              this.state.selectedAdapter === 'audiooutput') &&
              this.state.videoAudioDevices.map(device => {
                if (device.kind === this.state.selectedAdapter) {
                  return (
                    <ListItem key={device.label}>
                      <ListItemButton
                        onClick={() => {
                          addDevice(
                            device.label,
                            device.deviceId,
                            this.state.selectedAdapter === 'videoinput'
                              ? 'videoInput'
                              : 'audioOutput'
                          );
                          this.handleClose();
                        }}
                      >
                        {device.label}
                        <Box sx={{flexGrow: 1}} />
                        <IconButton edge="end" aria-label="connect">
                          <AddIcon />
                        </IconButton>
                      </ListItemButton>
                    </ListItem>
                  );
                }
              }))}
        </List>
      </Dialog>
    );
  }
}
