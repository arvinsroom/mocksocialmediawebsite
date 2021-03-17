import { Button, TextField, Snackbar } from '@material-ui/core';
import { useState } from 'react';
import { create } from '../../../../services/finish-service';
import useStyles from '../../../style';
import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';

const Finish = () => {
  const [redirectionLink, setRedirectionLink] = useState("");
  const [anyText, setAnyText] = useState("");
  const [pageName, setPageName] = useState("");

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

  // on first render check if user logged in, verify server
  // useEffect({

  // }, [])

  const resetValues = () => {
    setRedirectionLink("");
    setAnyText("");
    setPageName("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!templateId) {
      setMessage("Please make sure Template is created!");
      setOpen(true);
    }

    const finish = {
      templateId: templateId,
      name: pageName,
      type: "FINISH",
      finish: {
        redirectionLink,
        text: anyText,
      }
    };

    try {
      const { data } = await create(finish);
      if (data._id) {
        setMessage("Finish Page Successfully created!")
        setOpen(true);
        resetValues();
      }
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage)
      setOpen(true);
    }
  };

  if (!isLoggedIn) {
    return <Redirect to="/admin" />;
  }

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
        fullWidth
        id="redirectionLink"
        label="Provide a redirection link"
        onChange={({ target }) => setRedirectionLink(target.value)}
        autoFocus
      />
      <TextField
        variant="outlined"
        margin="normal"
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
    <Snackbar open={open} autoHideDuration={2000} message={message}>
    </Snackbar>
    </div>
    </>
  )
}

export default Finish;