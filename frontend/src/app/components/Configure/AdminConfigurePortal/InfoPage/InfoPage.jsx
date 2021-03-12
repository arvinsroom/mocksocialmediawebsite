import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MUIRichTextEditor from "mui-rte";

const InfoPage = () => {
  const [richData, setRichData] = useState("");
  const [message, setMessage] = useState("");

  // on first render check if user logged in, verify server
  // useEffect({

  // }, [])

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }
  }));

  const classes = useStyles();

  const handleSave = (data) => {
    setMessage("");

    // also send finished time

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