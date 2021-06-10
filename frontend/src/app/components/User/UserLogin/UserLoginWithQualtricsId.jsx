import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { Button, CssBaseline, TextField } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from "react-redux";
import useStyles from '../../style';
import InputAdornment from '@material-ui/core/InputAdornment';
import { IconKey } from '@tabler/icons';
import { showInfoSnackbar } from "../../../actions/snackbar";
import { updateUserMain } from '../../../actions/user';
import { USER_TRANSLATIONS_DEFAULT } from '../../../constants';
import "./UserLogin.css";

const UserLoginWithQualtricsId = () => {
  let history = useHistory();
  const [qualtricsId, setQualtricsId] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);
  const { accessCode } = useParams();

  if (!isLoggedInUser) return <Redirect to="/" />;

  const checkValidity = (id) => {
    if (id && id.length === 6 && Number(id)) return true;
    else return false;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (checkValidity(qualtricsId)) {
      // send the username and password to the server
      const qualCode = Number(qualtricsId);
      try {
        await dispatch(updateUserMain({ qualtricsId: qualCode }));
        history.push(`/${accessCode}/user-response`);
      } catch (error) {
        // history.push("/");
      }
    } else {
      dispatch(showInfoSnackbar((translations?.incorrect_access_code_or_participant_id) || USER_TRANSLATIONS_DEFAULT.INCORRECT_ACCESS_LOGIN_CODES));
    }
  };

  return (
    <>
    <Container component="main" maxWidth="xs" className={classes.centerCard}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name={USER_TRANSLATIONS_DEFAULT.PARTICIPANT_ID}
          label={(translations?.participant_id) || USER_TRANSLATIONS_DEFAULT.PARTICIPANT_ID}
          onChange={({ target }) => setQualtricsId(target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconKey />
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          className={classes.submit}
        >
          {(translations?.login) || USER_TRANSLATIONS_DEFAULT.LOGIN}
        </Button>
      </form>
    </Container>
    </>
  );
};

export default UserLoginWithQualtricsId;