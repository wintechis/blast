import React from 'react';
import PropTypes from 'prop-types';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import {importFromXml} from '../BlocklyWorkspace/useBlocklyWorkspace.ts';
import {getDevMode} from '../ThingsStore/things.ts';
import {getWorkspace} from '../BlocklyWorkspace/interpreter.ts';
import {requestDevice} from '../ThingsStore/devices/webBluetoothDevices.ts';
import {connectWebHidDevice} from '../ThingsStore/devices/hidDevices.ts';
import {connectGamepad} from '../ThingsStore/devices/gamepadDevices.ts';
import {addMediaDevice} from '../ThingsStore/devices/MediaDevices.ts';

export default class ReonnectDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aVDevice: null,
      aVDialogopen: false,
      connected: {},
      onclose: null,
      open: false,
      selectedThing: null,
      selectedThingName: null,
      things: {},
      mediaDevices: null,
      xml: {},
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleAVDialogClose = this.handleAVDialogClose.bind(this);
    this.getDevices = this.getDevices.bind(this);
  }

  static propTypes = {
    aVDevice: PropTypes.object,
    aVDialogopen: PropTypes.bool,
    connected: PropTypes.object,
    onclose: PropTypes.func,
    open: PropTypes.bool,
    selectedThing: PropTypes.object,
    selectedThingName: PropTypes.string,
    setSpheroConnected: PropTypes.func,
    things: PropTypes.object,
    mediaDevices: PropTypes.object,
    xml: PropTypes.object,
  };

  async getDevices(audio, video) {
    try {
      await navigator.mediaDevices.getUserMedia({audio, video});
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.setState({mediaDevices: devices});
    } catch (e) {
      // ignore DOMException: Requested device not found
      // This happens when the user has no camera or microphone
      if (e.name !== 'NotFoundError') {
        console.error(e);
      }
    }
  }

  handleClose() {
    if (this.allConnected() || getDevMode()) {
      this.setState({open: false});
      const workspace = getWorkspace();
      workspace.clear();
      importFromXml(this.state.xml, workspace, false);
      // this.state.onclose();
    } else {
      alert('Please connect all devices before continuing');
    }
  }

  allConnected() {
    for (const thingName of Object.keys(this.state.things)) {
      if (!this.state.connected[thingName]) {
        return false;
      }
    }
    return true;
  }

  async open(things, xml) {
    this.setState({things, xml, open: true});
  }

  handleAVDialogClose(device) {
    const thing = this.state.selectedThing;
    const thingName = this.state.selectedThingName;
    // set the device id in the xml
    const xml = this.state.xml;
    const blocks = xml.querySelectorAll(`block[type="things_${thing.id}"`);
    for (const block of blocks) {
      if (block.firstElementChild.textContent === thingName) {
        block.lastElementChild.textContent = device.id;
      }
    }
    const connected = this.state.connected;
    connected[thingName] = true;
    this.setState({
      xml,
      things: this.state.things,
      connected,
    });
    this.setState({aVDialogopen: false});
  }

  render() {
    return (
      <>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>
            Please connect these devices to load the program
          </DialogTitle>
          <List dense>
            {Object.keys(this.state.things).map(thingName => {
              const thing = this.state.things[thingName];
              return (
                <ListItem key={thingName}>
                  <ListItemButton
                    onClick={async () => {
                      let device;
                      if (thing.type === 'bluetooth') {
                        device = await requestDevice(thing, thingName);
                      } else if (thing.type === 'hid') {
                        device = await connectWebHidDevice(thing, thingName);
                      } else if (thing.type === 'gamepad') {
                        device = await connectGamepad(thing, thingName);
                      } else if (thing.type === 'audiooutput') {
                        await this.getDevices(true, false);
                        this.setState({
                          aVDialogopen: true,
                          selectedAdapter: thing.type,
                          selectedThing: thing,
                          selectedThingName: thingName,
                        });
                      } else if (thing.type === 'videoinput') {
                        await this.getDevices(false, true);
                        this.setState({
                          aVDialogopen: true,
                          selectedAdapter: thing.type,
                          selectedThing: thing,
                          selectedThingName: thingName,
                        });
                      }
                      if (device) {
                        if (thing.id === 'spheroMini') {
                          this.props.setSpheroConnected(true);
                        }
                        // set the device id in the xml
                        const xml = this.state.xml;
                        const blocks = xml.querySelectorAll(
                          `block[type="things_${thing.id}"`
                        );
                        for (const block of blocks) {
                          if (
                            block.firstElementChild.textContent === thingName
                          ) {
                            block.lastElementChild.textContent =
                              thing.type === 'gamepad'
                                ? device.index
                                : device.id;
                          }
                        }
                        const connected = this.state.connected;
                        connected[thingName] = true;
                        this.setState({
                          xml,
                          things: this.state.things,
                          connected,
                        });
                      }
                    }}
                  >
                    {thingName}
                    <IconButton edge="end" aria-label="connect">
                      {this.state.connected[thingName] ? (
                        <CheckIcon sx={{color: 'green'}} />
                      ) : (
                        <AddIcon />
                      )}
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <DialogActions>
            <Button onClick={this.handleClose}>Continue</Button>
          </DialogActions>
        </Dialog>
        {this.state.mediaDevices && (
          <Dialog
            open={this.state.aVDialogopen}
            onClose={this.handleAVDialogClose}
          >
            <DialogTitle>
              Please select a device from the list below
            </DialogTitle>
            <List dense>
              {this.state.mediaDevices.map(device => {
                if (device.kind === this.state.selectedAdapter) {
                  const thing = this.state.selectedThing;
                  return (
                    <ListItem key={device.label}>
                      <ListItemButton
                        onClick={() => {
                          addMediaDevice(
                            device,
                            thing,
                            this.state.selectedThingName
                          );
                          this.handleAVDialogClose(device);
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
              })}
            </List>
          </Dialog>
        )}
      </>
    );
  }
}
