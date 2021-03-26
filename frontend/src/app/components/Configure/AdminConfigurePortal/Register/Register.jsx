import { Button, FormControlLabel, FormGroup, Switch, FormControl, FormLabel, TextField } from '@material-ui/core';
import { useState } from 'react';
import useStyles from '../../../style';
import { useSelector, useDispatch } from "react-redux";
import { create } from '../../../../services/register-service';
import { Redirect } from 'react-router-dom';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { TEMPLATE, REGISTER_PAGE } from '../../../../constants';

const Register = () => {
  const [state, setState] = useState({
    requestPhoto: false,
    requestUsername: false,
  });
  const [pageName, setPageName] = useState("");

	const dispatch = useDispatch();
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

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
      dispatch(showErrorSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
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
        dispatch(showSuccessSnackbar(REGISTER_PAGE.REGISTER_PAGE_SUCCESS));
        resetValues();
      }
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        dispatch(showErrorSnackbar(resMessage));

    }
  };

  if (!isLoggedInAdmin) {
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
      <FormLabel component="legend">{REGISTER_PAGE.REGISTRATION_DETAILS}</FormLabel>
    </FormControl>
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className={classes.submit}
      >
        Save
      </Button>
    </form>
    </div>
    </>
  )
}

export default Register;
