import { Button, FormControlLabel, FormGroup, Switch, FormControl, FormLabel, TextField, Snackbar } from '@material-ui/core';
import { useState } from 'react';
import useStyles from '../../../style';
import { useSelector } from "react-redux";
import { create } from '../../../../services/register-service';
import { Redirect } from 'react-router-dom';

const Register = () => {
  const [state, setState] = useState({
    requestPhoto: false,
    requestUsername: false,
  });
  const [pageName, setPageName] = useState("");

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

  // on first render check if user logged in, verify server
  // useEffect({

  // }, [])

  const resetValues = () => {
    setPageName("");
    setState({
      requestPhoto: false,
      requestUsername: false,
    })
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!templateId) {
      setMessage("Please make sure Template is created!");
      setOpen(true);
    }

    const register = {
      templateId: templateId,
      name: pageName,
      type: "REGISTER",
      register: {
        profilePic: state.requestPhoto,
        username: state.requestUsername,
      }
    };
    try {
      const { data } = await create(register);
      if (data._id) {
        setMessage("Register Page Successfully created!")
        setOpen(true);
        resetValues();
      }
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage)
      setOpen(true);
    }
  };

  if (!isLoggedIn) {
    return <Redirect to="/admin" />;
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <>
    <div className={classes.paper}>
    <form onSubmit={handleSubmit} className={classes.form}>
    <TextField
        className={classes.marginBottom}
        margin="normal"
        required
        fullWidth
        value={pageName}
        label="Provide a unique page name"
        onChange={({ target }) => setPageName(target.value)}
        autoFocus
      />
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
    <Snackbar open={open} autoHideDuration={2000} message={message}>
    </Snackbar>
    </div>
    </>
  )
}

export default Register;
