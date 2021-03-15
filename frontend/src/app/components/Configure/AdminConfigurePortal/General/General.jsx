import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button, FormControlLabel, Switch, Typography, Input, FormGroup, Divider, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const General = ({templateId}) => {
  const [mediaJSON, setMediaJSON] = useState("");
  const [languageJSON, setLanguageJSON] = useState("");
  const [message, setMessage] = useState("");
  const [pageName, setPageName] = useState("");

  // useEffect(() => {
  //   console.log('This is the value of templateId: ', templateId);
  // }, [])

  /* list of supported file types */
  const SheetJSFT = [ "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"]
  .map(function(x) {
    return "." + x;
  }).join(",");

  const handleChange = (type, e) => {
    e.preventDefault();

    let files = e.target.files, f = files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, {type: 'binary'});
      /* Get first worksheet */
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
      /* Update state */
      if (type == "media") {
        setMediaJSON(dataParse);
      } else setLanguageJSON(dataParse);
    };
    reader.readAsBinaryString(f)
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    // const data = {
    //   templateId: templateId,
    //   name: pageName,
    //   type: "REGISTER",
    //   register: {
    //     profilePic: state.requestPhoto,
    //     username: state.requestUsername,
    //   }
    // };
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
    console.log('Language Data: ', languageJSON);
    console.log('Media Data: ', mediaJSON);
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
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 120,
      width: '100%'
    },
    divider: {
      margin: 20
    },
    marginBottom: {
      marginBottom: '10%'
    }
  }));

  const classes = useStyles();

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
      <Typography component="h6">
        Social Media Post Spreadsheet
      </Typography>
      <Input
        type="file"
        disableUnderline={true}
        required={true}
        accept={SheetJSFT}
        onChange={(e) => handleChange("media", e)}
      />
      <Divider className={classes.divider}/>
      <Typography component="h6">
        Language Spreadsheet
      </Typography>
      <Input
        type="file"
        disableUnderline={true}
        required={true}
        accept={SheetJSFT}
        onChange={(e) => handleChange("language", e)}
      />
      <Divider className={classes.divider}/>
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

      </div>
    {message && (
      <div className="form-group">
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      </div>
    )}
    </>
  );
};

export default General;
