import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, TextField } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useDispatch } from "react-redux";
import InputAdornment from '@material-ui/core/InputAdornment';
import { userLogin } from "../../../actions/userAuth";
import useStyles from '../../style';
import { showInfoSnackbar } from "../../../actions/snackbar";
import { USER_TRANSLATIONS_DEFAULT } from '../../../constants';
import { IconKey } from '@tabler/icons';
import "./UserLogin.css";

const UserLogin = () => {
  let history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { accessCode } = useParams();
  const [templateId, setTemplateId] = useState("");

  const checkValidity = (id) => {
    if (id && id.length === 6 && Number(id)) return true;
    else return false;
  }

  const checkTemplateExist = async (code) => {
    // dispatch
    if (checkValidity(code)) {
      const tempCode = Number(code);
      try {
        await dispatch(userLogin(tempCode));
        history.push(`/${tempCode}/participantId`);
      } catch (error) {
        history.push("/");
      }
    } else if (accessCode) {
      dispatch(showInfoSnackbar(USER_TRANSLATIONS_DEFAULT.INCORRECT_ACCESS_LOGIN_CODES));
    }
  };

  useEffect(() => {
    checkTemplateExist(accessCode);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    await checkTemplateExist(templateId);
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
