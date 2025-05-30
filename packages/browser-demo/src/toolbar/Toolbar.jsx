import React from 'react';
import {styled, alpha} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import Switch from '@mui/material/Switch';
import SaveIcon from '@mui/icons-material/Save';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {loadFromFile, loadSample, save} from './load.ts';
import logo from '../assets/logo.png';
import ReconnectDialog from './ReconnectDialog.jsx';
import SolidDialog from './SolidDialog.jsx';
import SpheroDialog from './SpheroDialog.jsx';

import {
  onStatusChange,
  runJS,
  stopJS,
} from '../BlocklyWorkspace/interpreter.ts';
import {setDevMode} from '../ThingsStore/things.ts';

const samples = [
  './samples/events.xml',
  './samples/everyMinutes.xml',
  './samples/gamble.xml',
  './samples/helloWorld.xml',
  './samples/lNdW.xml',
  './samples/objects.xml',
  './samples/playAudio.xml',
  './samples/requests.xml',
  './samples/rgbLights.xml',
  './samples/ruuviProperties.xml',
  './samples/signalStrength.xml',
  './samples/sounds.xml',
  './samples/streamdeck.xml',
  './samples/toggle.xml',
  './samples/webSpeech.xml',
];

const LoadSample = styled('div')(({theme}) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 1),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default class BlastBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'ready',
      devMode: false,
      spheroConnected: false,
    };
    this.reconnectDialogRef = React.createRef();
    this.SolidDialogRef = React.createRef();
    this.spheroDialogRef = React.createRef();
    onStatusChange.stopped.push(() => this.setStatus('stopped'));
    onStatusChange.running.push(() => this.setStatus('running'));
    onStatusChange.ready.push(() => this.setStatus('ready'));
    onStatusChange.error.push(() => this.setStatus('error'));
  }

  setStatus = status => {
    this.setState({status});
  };

  switchDevMode = () => {
    this.setState({devMode: !this.state.devMode});
    setDevMode(!this.state.devMode);
  };

  setSpheroConnected = connected => {
    this.setState({spheroConnected: connected});
  };

  render() {
    return (
      <AppBar>
        <ReconnectDialog
          ref={this.reconnectDialogRef}
          setSpheroConnected={this.setSpheroConnected}
        />
        <SpheroDialog ref={this.spheroDialogRef} />
        <SolidDialog ref={this.SolidDialogRef} />
        <Toolbar>
          <Box
            component="img"
            sx={{height: 32, width: 32, mr: 1}}
            src={logo}
            alt="logo"
          />
          <Typography variant="h5" component="div">
            BLAST
          </Typography>
          <Tooltip title="Load sample">
            <LoadSample>
              <Autocomplete
                disablePortal
                id="load-sample"
                options={samples}
                sx={{width: 300}}
                renderInput={params => {
                  // eslint-disable-next-line no-unused-vars
                  const {InputLabelProps, InputProps, ...other} = params;
                  return (
                    <StyledInputBase
                      {...params.InputProps}
                      {...other}
                      label="Load sample program"
                      placeholder="Load sample program"
                    />
                  );
                }}
                onChange={(event, value) => {
                  if (value) {
                    loadSample(value, this.reconnectDialogRef);
                  }
                }}
              />
            </LoadSample>
          </Tooltip>
          <Tooltip title="Open file">
            <IconButton
              size="large"
              aria-label="open file"
              color="inherit"
              component="label"
            >
              <input
                hidden
                accept=".xml"
                type="file"
                onChange={event => {
                  loadFromFile(event, this.reconnectDialogRef);
                }}
              />
              <FileOpenIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save to file">
            <IconButton
              size="large"
              aria-label="save program"
              color="inherit"
              onClick={() => {
                save();
              }}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Log in to Solid">
            <IconButton
              size="large"
              aria-label="log in to Solid"
              color="inherit"
              onClick={() => {
                this.SolidDialogRef.current.open();
              }}
            >
              <img
                src="https://solidproject.org/image/logo.svg"
                alt="solid logo"
                height="24"
              />
            </IconButton>
          </Tooltip>
          {this.state.spheroConnected && (
            <Tooltip title="Calibrate sphero">
              <IconButton
                size="large"
                aria-label="calibrate sphero"
                color="inherit"
                onClick={() => {
                  this.spheroDialogRef.current.open();
                }}
              >
                <ModelTrainingIcon />
              </IconButton>
            </Tooltip>
          )}
          <Box sx={{flex: 1}} />
          <Tooltip title="Toggle dev mode">
            <FormControl component="fieldset">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.devMode}
                      onChange={() => this.switchDevMode()}
                      color="warning"
                    />
                  }
                  label="dev mode"
                  labelPlacement="start"
                />
              </FormGroup>
            </FormControl>
          </Tooltip>
          <Tooltip title="Status">
            <Typography
              variant="body1"
              sx={{m: 1, width: '100px'}}
              align="right"
            >
              {this.state.status}
            </Typography>
          </Tooltip>
          <Tooltip title="Execute program">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="run"
              sx={{mr: 2}}
              onClick={() => {
                if (this.state.status === 'running') {
                  stopJS();
                } else {
                  runJS();
                }
              }}
              disabled={this.state.devMode}
            >
              {this.state.status === 'running' ? (
                <StopIcon />
              ) : (
                <PlayArrowIcon />
              )}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}
