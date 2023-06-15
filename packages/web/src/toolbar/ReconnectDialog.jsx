import React from 'react';
import PropTypes from 'prop-types';

import AddIcon from '@mui/icons-material/Add';
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
import {connectWebHidDevice} from '../assets/js/things.js';
import {getWorkspace} from '../assets/js/interpreter.ts';
import {requestDevice} from '../assets/js/webBluetooth.js';

export default class ReonnectDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onclose: null,
      open: false,
      things: {},
      xml: {},
    };
    this.handleClose = this.handleClose.bind(this);
  }

  static propTypes = {
    onclose: PropTypes.func,
    open: PropTypes.bool,
    setSpheroConnected: PropTypes.func,
    things: PropTypes.object,
    xml: PropTypes.object,
  };

  handleClose() {
    if (this.allConnected()) {
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
    return Object.values(this.state.things).every(thing => thing.connected);
  }

  async open(things, xml) {
    this.setState({things, xml, open: true});
  }

  render() {
    return (
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
                      device = await requestDevice(thing);
                    } else if (thing.type === 'hid') {
                      device = await connectWebHidDevice(thing);
                    }
                    if (device) {
                      if (thing.id === 'spheroMini') {
                        this.props.setSpheroConnected(true);
                      }
                      thing.connected = true;
                      // set the device id in the xml
                      const xml = this.state.xml;
                      const blocks = xml.querySelectorAll(
                        `block[type="things_${thing.id}"`
                      );
                      for (const block of blocks) {
                        if (block.firstElementChild.textContent === thingName) {
                          block.lastElementChild.textContent = device.id;
                        }
                      }
                      this.setState({xml, things: this.state.things});
                    }
                  }}
                >
                  {thingName}
                  <IconButton edge="end" aria-label="connect">
                    {thing.connected ? (
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
    );
  }
}
