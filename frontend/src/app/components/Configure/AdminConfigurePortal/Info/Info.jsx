import { TextField, Snackbar, Button } from '@material-ui/core';
import { useState } from 'react';
import { create } from '../../../../services/info-service';
import useStyles from '../../../style';
import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';
import React, { useRef} from 'react';

const InfoPage = () => {
  const [richData, setRichData] = useState("<span>type here...</span>");
  const [pageName, setPageName] = useState("");

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useSelector(state => state.auth);
  const { _id: templateId } = useSelector(state => state.template);
  const classes = useStyles();

  const editor = useRef(null)
	const [content, setContent] = useState('')
	
  // on first render check if user logged in, verify server
  // useEffect({

  // }, [])

  const resetValues = () => {
    setPageName("");
    setRichData("");
  };

  const handleSave = (data) => {
    if (!templateId) {
      setMessage("Please make sure Template is created!");
      setOpen(true);
    }

    const info = {
      templateId: templateId,
      name: pageName,
      type: "INFO",
      info: {
        richText: data,
      }
    };
    console.log('info: ', info);
    try {
      // const { data } = await create(info);
      // if (data._id) {
      //   setMessage("Info Page Successfully created!")
      //   setOpen(true);
      //   resetValues();
      // }
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

	const config = {
		readonly: false // all options from https://xdsoft.net/jodit/doc/
	}

  return (
    <>
    <div className={classes.paper}>
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Save
      </Button>
      <Snackbar open={open} autoHideDuration={2000} message={message}>
      </Snackbar>
    </div>
    
    </>
  )
}

export default InfoPage;