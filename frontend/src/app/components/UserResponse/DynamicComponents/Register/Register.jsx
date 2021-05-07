import { getUserRegisterDetails, createUserRegister } from '../../../../services/register-service';
import { useEffect, useState } from "react";
import { Button, TextField, Input, Container, Avatar, Fab } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showInfoSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import "./Register.css";
import { updateFlowActiveState } from '../../../../actions/flowState';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../constants';

const Register = ({ data }) => {
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);
  // initilize register state
  const [registerState, setRegisterState] = useState({});
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    const ret = await getUserRegisterDetails(data._id);
    const obj = ret.data?.data || null
    // add only the true properties in requestState to registerState
    let newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value) newObj[key] = "";
    }
    setRegisterState(newObj);
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    fetch();
  }, []);

  const checkValidity = () => {
    for (const [, value] of Object.entries(registerState)) {
      if (!value) return false;
    }
    return true;
  }

  const handleClick = async e => {
    e.preventDefault();

    try {
      if (checkValidity()) {
        // check validity before sending the data
        let formData = new FormData();
        formData.append("file", registerState?.profilePic || null);
        formData.append("username", registerState?.username || null);

        await createUserRegister(formData);
        dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
        dispatch(updateFlowActiveState());
      } else {
        dispatch(showInfoSnackbar((translations?.please_answer_all_required_questions_to_continue) || USER_TRANSLATIONS_DEFAULT.ENTER_REQUIRED_INFO));
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
      setRegisterState({ ...registerState, [event.target.name]: event.target.files[0] });
      setAvatar(URL.createObjectURL(event.target.files[0]));
    }
  }

  return (
    <>
      <Container component="main" maxWidth="md" className={classes.card}>
        {('profilePic' in registerState) ?
          <div className="registerTop">
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
                variant="extended">
                <AddIcon /> {USER_TRANSLATIONS_DEFAULT.UPLOAD}
              </Fab>
            </label>

          </div>
          : null}

        {('username' in registerState) ?
          <>
            <TextField
              className={classes.marginBottom}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="username"
              value={registerState.username}
              label={USER_TRANSLATIONS_DEFAULT.TYPE_YOUR_USERNAME_HERE}
              onChange={handleUsername}
              autoFocus
            />
          </> : null}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ float: 'right', width: '25%' }}
          onClick={handleClick}
          className={classes.submit}
        >
          <ArrowForwardIosIcon style={{ fontSize: 15 }} />
        </Button>
      </Container>
    </>
  );
};

export default Register;