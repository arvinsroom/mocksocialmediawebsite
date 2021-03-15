import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MUIRichTextEditor from "mui-rte";

const InfoPage = ({templateId}) => {
  const [richData, setRichData] = useState("");
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
    marginBottom:{
      marginBottom: '10%'
    }
  }));

  const classes = useStyles();

  const handleSave = (data) => {
    setMessage("");

    const result = {
      templateId: templateId,
      name: pageName,
      type: "INFO",
      register: {
        richText: data,
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
    console.log('Rich Data: ', data);
  };

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
      <MUIRichTextEditor
        label="Type something here..."
        // defaultValue={richData}
        onSave={handleSave}
        inlineToolbar={false}
      />
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

export default InfoPage;