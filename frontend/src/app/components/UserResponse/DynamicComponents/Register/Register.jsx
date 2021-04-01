import { getUserRegisterDetails, createUserRegister } from '../../../../services/register-service';
import { useEffect, useState } from "react";
import { Button, TextField, Card, Link, CardMedia, Input, Typography, IconButton, Avatar } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import "./Register.css";

const Register = ({ data }) => {

  const [requestState, setRequestState] = useState(null);
  // initilize register state
  const [registerState, setRegisterState] = useState({
    profilePic: null,
    username: null,
  });
  const [avatar, setAvatar] = useState("");


  const dispatch = useDispatch();
  const classes = useStyles();
  
  const fetch = async () => {
    const ret = await getUserRegisterDetails(data._id);
    const obj = ret.data.data || null; // redirection Link and text to render
    await setRequestState(obj);
  };

  useEffect(() => {
    fetch();
  }, []);

  // we destroy the setRequestState
  // so this limit per user 1 response
  const resetValues = () => {
    setRequestState(null);
    setRegisterState({
      username: null,
      profilePic: null
    });
    setAvatar("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      let formData = new FormData();
      if (requestState.profilePic) {
        // profile pic was requested
        formData.append("file", registerState.profilePic);
      }
      if (requestState.username) {
        formData.append("username", registerState.username);
      }

      if (formData.has("file") || formData.has("username")) {
        await createUserRegister(formData);
        dispatch(showSuccessSnackbar("Success! Registration details have been saved! Please follow to the next Page!"));
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
      {requestState && requestState.profilePic ? 
      <div className="registerTop">
        <Typography component="h6" className={classes.title}>
          Please upload your profile pic below
        </Typography>
        <Avatar 
          src={avatar}
          className="registerTopAvatar"
        />
        <Input
          type="file"
          className="registerTopInput"
          inputProps={{ multiple: false }}
          accept="image/*"
          name="profilePic"
          disableUnderline={true}
          onChange={onImageChange}
          required
        />
      </div>
      : null}

      {requestState && requestState.username ? 
        <TextField
        className={classes.marginBottom}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="username"
        value={registerState.username || ""}
        label="Please provide a username"
        onChange={handleUsername}
        autoFocus
      /> : null }
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!registerState.profilePic || !registerState.username}
        className={classes.submit}
      >
        Save
      </Button>
    </form>
   </>
  );
};

export default Register;