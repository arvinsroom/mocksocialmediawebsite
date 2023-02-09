import { Button, TextField, Container } from '@material-ui/core';
import { useState } from 'react';
import { create } from '../../../../../services/finish-service';
import useStyles from '../../../../style';
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from 'react-router-dom';
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../../actions/snackbar';
import { TEMPLATE, FINISH_PAGE } from '../../../../../constants';
import { checkIfEmptyRichText } from '../../../../../utils';
import { IconDeviceFloppy } from '@tabler/icons-react';
import clsx from 'clsx';

const Finish = () => {
  const [clearRichText, setClearRichText] = useState(false);
  const [richText, setRichText] = useState(null);
  const [redirectionLink, setRedirectionLink] = useState("");
  const [anyText, setAnyText] = useState("");
  const [pageName, setPageName] = useState("");
  const dispatch = useDispatch();
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

  const resetValues = () => {
    setClearRichText(true);
    setRedirectionLink("");
    setAnyText("");
    setPageName("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }

    const finish = {
      templateId: templateId,
      name: pageName,
      type: "FINISH",
      richText: checkIfEmptyRichText(richText) ? null : richText,
      finish: {
        redirectionLink,
        text: anyText,
      }
    };

    try {
      const { data } = await create(finish);
      if (data._id) {
        dispatch(showSuccessSnackbar(FINISH_PAGE.SUCCESSFULLY_CREATED_REDIRECT_PAGE));
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

  if (!isLoggedInAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <Container component="main" maxWidth="lg" className={classes.card}>
    <h1>Redirect Page</h1>
    <form onSubmit={handleSubmit} className={classes.form}>
      <TextField
        className={classes.marginBottom}
        margin="normal"
        required
        fullWidth
        value={pageName}
        label={FINISH_PAGE.PROVIDE_A_UNIQUE_PAGE_NAME}
        onChange={({ target }) => setPageName(target.value)}
        autoFocus
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        value={redirectionLink}
        id="redirectionLink"
        label={FINISH_PAGE.PROVIDE_A_REDIRECTION_LINK}
        onChange={({ target }) => setRedirectionLink(target.value)}
        autoFocus
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="anyText"
        value={anyText}
        label={FINISH_PAGE.TYPE_TEXT_ALONGSIDE_REDIRECTION_LINK}
        onChange={({ target }) => setAnyText(target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<IconDeviceFloppy />}
        className={clsx(classes.submit, classes.widthFitContent)}
      >
        Save
      </Button>
    </form>
    </Container>
  )
}

export default Finish;