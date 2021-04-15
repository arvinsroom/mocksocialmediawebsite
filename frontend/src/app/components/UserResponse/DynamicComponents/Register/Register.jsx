import { getUserRegisterDetails, createUserRegister } from '../../../../services/register-service';
import { useEffect, useState } from "react";
import { Button, TextField, Card, Link, CardMedia, Input, Typography, IconButton, Avatar, Fab } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../actions/snackbar';
import "./Register.css";
import { updateFlowDisabledState } from '../../../../actions/flowState';

const Register = ({ data }) => {
  const { isLoggedInUser } = useSelector(state => state.userAuth);
  // initilize register state
  const [registerState, setRegisterState] = useState(null);
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();
  const classes = useStyles();
  
  const fetch = async () => {
    const ret = await getUserRegisterDetails(data._id);
    const obj = ret.data?.data || null;
    if (obj === null) {
      dispatch(showInfoSnackbar("You can proceed further!"));
      dispatch(updateFlowDisabledState()); // some othe error occured, let them go through for now
    }
    // add only the true properties in requestState to registerState
    let newObj = {};
    // add profilePic or/and username
    for (const [key, value] of Object.entries(obj)) {
      if (value) newObj[key] = "";
    }
    if (newObj && Object.keys(newObj).length === 0 && newObj.constructor === Object) {
      // not possible but still a check
      dispatch(updateFlowDisabledState());
    }
    setRegisterState(newObj);
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    fetch();
  }, []);

  // we destroy the setRequestState
  // so this limit per user 1 response
  const resetValues = () => {
    let newObj = {};
    for (const [key, ] of Object.entries(registerState)) {
      newObj[key] = "";
    }
    setRegisterState(newObj);
    setAvatar("");
  };

  const checkValidity = () => {
    for (const [, value] of Object.entries(registerState)) {
      if (!value) return false;
    }
    return true;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (checkValidity()) {
        // check validity before sending the data
        let formData = new FormData();
        formData.append("file", registerState?.profilePic || null);
        formData.append("username", registerState?.username || null);

        await createUserRegister(formData);
        dispatch(showSuccessSnackbar("Success! Registration details have been saved! Please follow to the next Page!"));
        resetValues();
        dispatch(updateFlowDisabledState());
      } else {
        dispatch(showErrorSnackbar('Please fill in required values!'));
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

  const handleUsername = (e) => {
    setRegisterState({ ...registerState, [e.target.name]: e.target.value })
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setRegisterState({ ...registerState, [event.target.name]: event.target.files[0]});
      setAvatar(URL.createObjectURL(event.target.files[0]));
    }
  }
   
  return (
   <>
    <form onSubmit={handleSubmit} className={classes.form}>
      {registerState && ('profilePic' in registerState) ? 
      <div className="registerTop">
        <Typography component="h6" className={classes.title}>
          Please upload your profile pic below
        </Typography>
        <Avatar 
          src={avatar}
          className="registerTopAvatar"
        />

      <label htmlFor="upload-photo">
        <Input
          style={{ display: "none" }}
          id="upload-photo"
          name="profilePic"
          type="file"
          inputProps={{ multiple: false }}
          accept="image/*"
          onChange={onImageChange}
          required
        />
        <Fab
          className="registerTopInput"
          color="primary"
          size="small"
          component="span"
          aria-label="add"
          variant="extended"
        >
          <AddIcon /> Upload photo
        </Fab>
      </label>

      </div>
      : null}

      {registerState && ('username' in registerState) ? 
      <>
        <TextField
        className={classes.marginBottom}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="username"
        value={registerState.username}
        label="Please provide a username"
        onChange={handleUsername}
        autoFocus
      />
      </>: null }
      
      {registerState && <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className={classes.submit}
      >
        Save
      </Button>}
    </form>
   </>
  );
};

export default Register;