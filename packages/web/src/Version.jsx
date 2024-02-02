import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Version() {
  const [state, setState] = React.useState({
    open: true,
    vertical: 'bottom',
    horizontal: 'right',
  });

  // This constant will be updated by gulp on build
  const rev = '#b353e62';

  const {vertical, horizontal, open} = state;

  const handleClose = () => {
    setState({...state, open: true});
  };

  return (
    <Snackbar
      anchorOrigin={{vertical, horizontal}}
      open={open}
      onClose={handleClose}
      message={'BLAST version ' + rev}
      key={vertical + horizontal}
      // open https://github.com/wintechis/blast/ as action
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => {
              window.open('https://github.com/wintechis/blast/');
            }}
          >
            <GitHubIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}
