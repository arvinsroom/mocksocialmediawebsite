import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, CssBaseline, TextField, Typography, CircularProgress } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../actions/userAuth";
import useStyles from '../style';

const UserLogin = () => {
  let history = useHistory();
  const [userLoginState, setUserLoginState] = useState({
    templateId: "",
    qualtricsId: "",
  });
  const classes = useStyles();
  const { isLoggedInUser } = useSelector(state => state.userAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedInUser) history.push("/user-response");
  }, [history, isLoggedInUser]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (userLoginState.templateId) {
      // send the username and password to the server
      dispatch(userLogin(userLoginState.templateId, userLoginState.qualtricsId))
        .then(() => {
          history.push("/user-response");
        })
        .catch(() => {
          // dispatch should handle error response
        });
    }
  };

  return (
    <>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component={'span'} variant="h5">
          Sign in for providing Response
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="templateId"
            label="Template Id"
            onChange={({ target }) => setUserLoginState({ ...userLoginState, [target.name]: target.value })}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="qualtricsId"
            label="Qualtrics Id"
            onChange={({ target }) => setUserLoginState({ ...userLoginState, [target.name]: target.value })}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          {/* {isLoading && <CircularProgress />} */}
        </form>
      </div>
    </Container>
    </>
  );
};

export default UserLogin;
