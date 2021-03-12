import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, FormControlLabel, Switch, Typography, Input, FormGroup, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const General = () => {
  const [mediaJSON, setMediaJSON] = useState("");
  const [languageJSON, setLanguageJSON] = useState("");
  const [permissions, setPermissions] = useState({
    requestAudio: false,
    requestVideo: false,
    requestCookies: false,
  });
  const [message, setMessage] = useState("");


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
    console.log('Audio permission: ', permissions.requestAudio);
    console.log('video permission: ', permissions.requestVideo);
    console.log('cookies permission: ', permissions.requestCookies);
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
    }
  }));

  const classes = useStyles();

  const handlePermissions = (event) => {
    setPermissions({ ...permissions, [event.target.name]: event.target.checked });
  };

  return (
    <>
    <div className={classes.paper}>
    <form onSubmit={handleSubmit} className={classes.form}>
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
      <Typography component="h6">
        Please provide additional permissions?
      </Typography>
      <FormGroup>
      <FormControlLabel
        control={<Switch
          checked={permissions.requestAudio}
          onChange={handlePermissions}
          color="primary"
          name="requestAudio"
          inputProps={{ 'aria-label': 'Request audio permissions' }}
        />}
        label="Request Audio"
      />
      <FormControlLabel
        control={<Switch
          checked={permissions.requestVideo}
          onChange={handlePermissions}
          color="primary"
          name="requestVideo"
          inputProps={{ 'aria-label': 'Request Video permission' }}
        />}
        label="Request Video"
      />
      <FormControlLabel
        control={<Switch
          checked={permissions.requestCookies}
          onChange={handlePermissions}
          color="primary"
          name="requestCookies"
          inputProps={{ 'aria-label': 'Request Cookies permission' }}
        />}
        label="Request Cookies"
      />
      </FormGroup>
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
