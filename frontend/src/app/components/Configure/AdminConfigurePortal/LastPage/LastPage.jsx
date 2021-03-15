import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { TEMPLATE_TYPES } from '../../../../constants';
import { makeStyles } from '@material-ui/core/styles';

const LastPage = ({templateId}) => {
  const [redirectionLink, setRedirectionLink] = useState("");
  const [anyText, setAnyText] = useState("");
  const [message, setMessage] = useState("");
  const [pageName, setPageName] = useState("");

  // on first render check if user logged in, verify server
  // useEffect({

  // }, [])

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
    marginBottom:{
      marginBottom: '10%'
    }
  }));

  const classes = useStyles();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    const data = {
      templateId: templateId,
      name: pageName,
      type: "FINISH",
      register: {
        redirectionLink,
        text: anyText,
      }
    };

    // send the username and password to the server
    // login(username, password).then(
    //   () => {
    //     history.push("/admin/configure");
    //     window.location.reload();
    //   },
    //   (error) => {
    //     const resMessage =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //     console.log('errorMessage: ', resMessage);
    //     setMessage(resMessage);
    //   }
    // );
    console.log('Redirection Link: ', redirectionLink);
    console.log('Text : ', anyText);
  };

  return (
    <>
    <div className={classes.paper}>
    <form onSubmit={handleSubmit} className={classes.form}>
      <TextField
        className={classes.marginBottom}
        margin="normal"
        required
        fullWidth
        value={pageName}
        label="Provide a unique page name"
        onChange={({ target }) => setPageName(target.value)}
        autoFocus
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="redirectionLink"
        label="Provide a redirection link"
        onChange={({ target }) => setRedirectionLink(target.value)}
        autoFocus
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="anyText"
        label="Provide text to be rendered on last page"
        onChange={({ target }) => setAnyText(target.value)}
        autoFocus
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Save
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
    </>
  )
}

export default LastPage;