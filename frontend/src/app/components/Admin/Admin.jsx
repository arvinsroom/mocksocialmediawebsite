import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, CssBaseline, TextField, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import useStyles from '../style';
import Progress from '../Progress';

const Admin = () => {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedInAdmin) history.push("/admin/configure");
  }, [history, isLoggedInAdmin]);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    // send the username and password to the server
    dispatch(login(username, password))
      .then(() => {
        history.push("/admin/configure");
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component={'span'} variant="h5">
          Sign in
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="usename"
            label="Username"
            autoComplete="username"
            onChange={({ target }) => setUsername(target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={({ target }) => setPassword(target.value)}
          />
          {isLoading && <Progress />}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
    </>
  );
};

export default Admin;
