import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, CssBaseline, TextField, Typography, CircularProgress, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";

const Admin = () => {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) history.push("/admin/configure");
  }, [history, isLoggedIn]);

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
        setOpen(true);
      });
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

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
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          {isLoading && <CircularProgress />}
        </form>
      <Snackbar open={open} autoHideDuration={2000} message={message}>
      </Snackbar>
      </div>
    </Container>
    </>
  );
};

export default Admin;
