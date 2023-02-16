import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useDispatch } from "react-redux";
import InputAdornment from '@material-ui/core/InputAdornment';
import { userLogin } from "../../../actions/userAuth";
import { updateUserMain } from '../../../actions/user';
import useStyles from '../../style';
import { showInfoSnackbar } from "../../../actions/snackbar";
import { USER_TRANSLATIONS_DEFAULT } from '../../../constants';
import { IconKey } from '@tabler/icons-react';
import "./UserLogin.css";

const UserLogin = () => {
  let history = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { accessCode, participantId } = useParams();
  const [templateId, setTemplateId] = useState("");

  const checkValidity = (id) => {
    if (id && id.length === 6 && Number(id)) return true;
    else return false;
  }

  const checkTemplateExist = async (code, parId) => {
    // dispatch
    if (checkValidity(code)) {
      const tempCode = Number(code);
      if (checkValidity(parId)) {
        const qualCode = Number(parId);
        try {
          await dispatch(userLogin(tempCode));
          await dispatch(updateUserMain({ qualtricsId: qualCode }));
          history(`/${accessCode}/user-response`);
        } catch (error) {
          history("/");
        }
      }
      else {
        try {
          await dispatch(userLogin(tempCode));
          history(`/${tempCode}/participantId`);
        } catch (error) {
          history("/");
        }
      }
    } else if (accessCode) {
      dispatch(showInfoSnackbar(USER_TRANSLATIONS_DEFAULT.INCORRECT_ACCESS_LOGIN_CODES));
    }
  };

  useEffect(() => {
    checkTemplateExist(accessCode, participantId);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    await checkTemplateExist(templateId, undefined);
  };

  return (
    <>
    <Container component="main" maxWidth="xs" className={classes.centerCard}>
      <form onSubmit={handleSubmit} className="login">
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label={USER_TRANSLATIONS_DEFAULT.ACCESS_CODE}
          onChange={({ target }) => setTemplateId(target.value)}
          name={USER_TRANSLATIONS_DEFAULT.ACCESS_CODE}
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
          {USER_TRANSLATIONS_DEFAULT.LOGIN}
        </Button>
      </form>
    </Container>
    </>
  );
};

export default UserLogin;
