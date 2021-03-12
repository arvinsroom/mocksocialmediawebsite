import React, { useEffect, useState } from "react";
import { getCurrentUser, login, verifyAdmin } from "../../services/auth-service";
import { useHistory } from "react-router-dom";
import { Button, CssBaseline, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const Admin = () => {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState();
  const [message, setMessage] = useState("");

  useEffect(() => {
    // const loggedInUser = getCurrentUser();
    // if (loggedInUser) {
    //   console.log('founduser', foundUser);
    // }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    // const user = { username, password };
    // console.log('username: ', username);
    // console.log('password: ', password);

    // send the username and password to the server
    login(username, password).then(
      () => {
        history.push("/admin/configure");
        // window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log('errorMessage: ', resMessage);
        setMessage(resMessage);
      }
    );
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
        <Typography component={'span'} component="h1" variant="h5">
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
        </form>
        {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )}
      </div>
    </Container>
    </>
  );
};

export default Admin;