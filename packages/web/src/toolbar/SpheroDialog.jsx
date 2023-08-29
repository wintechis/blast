import React from 'react';
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import CircularSlider from '@fseehawer/react-circular-slider';
import {spheroIds, spheroInstances} from '../assets/js/things/sphero/blocks.ts';

export default class SpheroDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      lastSetHeading: 0,
      spheroId: [...spheroIds.keys()][0],
    };
    this.handleClose = this.handleClose.bind(this);
    this.setHeading = this.setHeading.bind(this);
  }

  open() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  setHeading(angle) {
    // only set heading every 100ms
    if (Date.now() - this.state.lastSetHeading > 100) {
      this.setState({lastSetHeading: Date.now()});
      const sphero = spheroInstances.get(this.state.spheroId);
      sphero.setHeading(angle);
    }
  }

  render() {
    return (
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <DialogTitle>
          Drag the slider below, until the sphero&apos;s blue LED is pointing at
          you
        </DialogTitle>
        <Container>
          <FormControl fullWidth>
            <Typography variant="body1">
              (Only Spheros in the workspace are selectible)
            </Typography>
            <InputLabel id="sphero-select-label">Sphero</InputLabel>
            <Select
              labelId="sphero-select-label"
              id="sphero-select"
              label="Sphero"
              onChange={event => {
                const spheroId = event.target.value;
                this.setState({spheroId});
                const sphero = spheroInstances.get(spheroId);
                sphero.setAllLeds(0, 0, 0);
                sphero.setBackLedIntensity(255);
              }}
            >
              {[...spheroIds.keys()].map(key => {
                return (
                  <MenuItem key={key} value={spheroIds.get(key)}>
                    {key}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box sx={{width: 340, height: 340, m: 'auto'}}>
            <CircularSlider
              width={300}
              height={300}
              knobRadius={20}
              progressWidth={20}
              progressColorFrom="#3f51b5"
              progressColorTo="#3f51b5"
              progressSize={20}
              progressLinecap="round"
              knobColor="#3f51b5"
              min={0}
              max={359}
              value={0}
              onChange={this.setHeading}
            />
          </Box>
        </Container>
      </Dialog>
    );
  }
}
