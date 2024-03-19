import React from 'react';
import {
  Autocomplete,
  Button,
  Container,
  Dialog,
  DialogTitle,
  FormControl,
  TextField,
} from '@mui/material';
import {
  login,
  handleIncomingRedirect,
  fetch,
  getDefaultSession,
} from '@inrupt/solid-client-authn-browser';

export default class SolidDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.login = this.login.bind(this);
  }

  open() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  async login() {
    await login({
      oidcIssuer: this.state.oidcIssuer,
      redirectUrl: window.location.origin,
      clientName: 'BLAST',
      clientDescription: 'BLAST - Block Applications for Things',
    });
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      const webId = session.info.webId;
      console.log(`Logged in as ${webId}`);
      const profile = await fetch(webId);
      const profileJson = await profile.json();
      console.log(profileJson);
    }
  }

  providers = [
    'https://inrupt.net',
    'https://solidcommunity.net',
    'https://solidweb.org',
    'https://trinpod.us',
    'https://solidweb.me',
  ];

  render() {
    return (
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <DialogTitle>Log in to Solid</DialogTitle>
        <Container sx={{display: 'flex', flexDirection: 'column'}}>
          <FormControl sx={{m: 1, minWidth: 120}}>
            <Autocomplete
              freeSolo
              labelId="oidc-issuer-label"
              id="oidc-issuer"
              label="OIDC Issuer"
              options={this.providers}
              sx={{width: 300}}
              renderInput={params => (
                <TextField {...params} label="OIDC Issuer" />
              )}
              onChange={(event, value) => {
                this.setState({oidcIssuer: value});
              }}
            />
          </FormControl>
          <Button onClick={this.login}>Log in</Button>
        </Container>
      </Dialog>
    );
  }
}
