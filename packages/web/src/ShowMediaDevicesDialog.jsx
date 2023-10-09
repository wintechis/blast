import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import {addMediaDevice} from './ThingsStore/MediaDevices.ts';
import {
  implementedThings,
  setAudioSelectButtonHandler,
  setVideoSelectButtonHandler,
} from './ThingsStore/things.ts';

export default class ShowMediaDevicesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MediaDevices: null,
      open: false,
      selectedAdapter: null,
    };
    this.handleClose = this.handleClose.bind(this);
    this.getDevices = this.getDevices.bind(this);
  }

  componentDidMount() {
    setAudioSelectButtonHandler(() => {
      this.setState({open: true, selectedAdapter: 'audiooutput'});
    });
    setVideoSelectButtonHandler(() => {
      this.setState({open: true, selectedAdapter: 'videoinput'});
    });
    this.getDevices();
  }

  handleClose() {
    this.setState({open: false});
  }

  async getDevices() {
    try {
      await navigator.mediaDevices.getUserMedia({audio: true, video: true});
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.setState({MediaDevices: devices});
    } catch (e) {
      // ignore DOMException: Requested device not found
      // This happens when the user has no camera or microphone
      if (e.name !== 'NotFoundError') {
        console.error(e);
      }
    }
  }

  render() {
    return (
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <DialogTitle>Please select a device from the list below</DialogTitle>
        <List dense>
          {(this.state.selectedAdapter &&
            this.state.MediaDevices.length > 0 &&
            this.state.MediaDevices?.map(device => {
              const thing = implementedThings.find(
                implementedThing =>
                  implementedThing.type === this.state.selectedAdapter
              );
              if (device.kind === this.state.selectedAdapter) {
                return (
                  <ListItem key={device.label}>
                    <ListItemButton
                      onClick={() => {
                        addMediaDevice(device, thing);
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
            })) || (
            <ListItem>
              <ListItemButton>
                No {this.state.selectedAdapter} devices found
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Dialog>
    );
  }
}
