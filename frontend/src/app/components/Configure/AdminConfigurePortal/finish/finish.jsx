import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';
import { create } from '../../../../services/finish-service';
import useStyles from '../../../style';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { TEMPLATE, FINISH_PAGE } from '../../../../constants';

const Finish = () => {
  const [redirectionLink, setRedirectionLink] = useState("");
  const [anyText, setAnyText] = useState("");
  const [pageName, setPageName] = useState("");
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

  const resetValues = () => {
    setRedirectionLink("");
    setAnyText("");
    setPageName("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!templateId) {
      dispatch(showErrorSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
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
        dispatch(showSuccessSnackbar(FINISH_PAGE.FINISH_PAGE_SUCCESS));
        resetValues();
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
        value={redirectionLink}
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
        value={anyText}
        label="Provide text to be rendered on last page"
        onChange={({ target }) => setAnyText(target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className={classes.submit}
      >
        Save
      </Button>
    </form>
    </div>
    </>
  )
}

export default Finish;