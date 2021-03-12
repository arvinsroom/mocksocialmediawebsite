import { Button, FormControlLabel, FormGroup, Switch, FormControl, FormLabel } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const Register = () => {
  const [state, setState] = useState({
    requestPhoto: false,
    requestUsername: false,
    requestQualtricsCode: false,
  });
  const [message, setMessage] = useState("");

  // on first render check if user logged in, verify server
  // useEffect({

  // }, [])

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 120,
      width: '100%'
    },
  }));

  const classes = useStyles();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    // send the username and password to the server
    // login(username, password).then(
    //   () => {
    //     history.push("/admin/configure");
    //     window.location.reload();
    //   },
    //   (error) => {
    //     const resMessage =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //     console.log('errorMessage: ', resMessage);
    //     setMessage(resMessage);
    //   }
    // );
    console.log('Request Photo: ', state.requestPhoto);
    console.log('Request Username: ', state.requestUsername);
    console.log('Request Qualtrics Code: ', state.requestQualtricsCode);
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <>
    <div className={classes.paper}>
    <form onSubmit={handleSubmit} className={classes.form}>
    <FormControl component="fieldset">
      <FormLabel component="legend">Please provide additional requests for registrations?</FormLabel>

    <FormGroup>
        <FormControlLabel
          control={<Switch
            checked={state.requestPhoto}
            onChange={handleChange}
            color="primary"
            name="requestPhoto"
            inputProps={{ 'aria-label': 'Request photo checkbox' }}
          />}
          label="Request Photo"
        />
        <FormControlLabel
          control={<Switch
            checked={state.requestUsername}
            onChange={handleChange}
            color="primary"
            name="requestUsername"
            inputProps={{ 'aria-label': 'Request username checkbox' }}
          />}
          label="Request Username"
        />
        <FormControlLabel
          control={<Switch
            checked={state.requestQualtricsCode}
            onChange={handleChange}
            color="primary"
            name="requestQualtricsCode"
            inputProps={{ 'aria-label': 'Request qualtrics code checkbox' }}
          />}
          label="Request Qualtrics Code"
        />
      </FormGroup>
    </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Save
      </Button>
    </form>
      {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default Register;
