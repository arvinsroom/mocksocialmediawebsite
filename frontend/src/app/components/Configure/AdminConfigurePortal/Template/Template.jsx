import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { TEMPLATE_TYPES } from '../../../../constants';
import { makeStyles } from '@material-ui/core/styles';

const Template = ({setTemplateId}) => {
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [message, setMessage] = useState("");
  const [randomPosts, setRandomPosts] = useState(false);
  const [requiredQualtricsId, setRequiredQualtricsId] = useState(false);
  const [permissions, setPermissions] = useState({
    requestAudio: false,
    requestVideo: false,
    requestCookies: false,
  });

  // on first render check if user logged in, verify server
  useEffect(() => {
    // setTimeout(() => {
    //   setTemplateId("testing id");
    // }, 3000);
  }, [])

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
    marginBottom:{
      marginBottom: '10%'
    }
  }));

  const classes = useStyles();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    const data = {
      name: templateName,
      type: templateType,
      randomPosts,
      requestAudio: permissions.requestAudio,
      requestVideo: permissions.requestVideo,
      requestCookies: permissions.requestCookies,
      qualtricsId: requiredQualtricsId,
      flow: "",
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
    console.log('Template Name: ', templateName);
    console.log('Template Type: ', templateType);
    console.log('Enable Random posts: ', randomPosts);
    console.log('Audio permission: ', permissions.requestAudio);
    console.log('video permission: ', permissions.requestVideo);
    console.log('cookies permission: ', permissions.requestCookies);
    console.log('qualtrics Id required: ', requiredQualtricsId);
  };

  const handleChange = (event) => {
    setTemplateType(event.target.value);
  };

  const handleRandomPosts = (e) => {
    setRandomPosts(e.target.checked);
  };

  const handleQualtricsId = (e) => {
    setRequiredQualtricsId(e.target.checked);
  };

  const handlePermissions = (event) => {
    setPermissions({ ...permissions, [event.target.name]: event.target.checked });
  };

  const createMenuItems = () => {
    let menuItems = [];
    for (let item in TEMPLATE_TYPES) {
      menuItems.push(<MenuItem value={item} key={item}>{item}</MenuItem>)
    }
    return menuItems;
  }

  return (
    <>
    <div className={classes.paper}>
    <form onSubmit={handleSubmit} className={classes.form}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="templateName"
        label="Provide a template name"
        onChange={({ target }) => setTemplateName(target.value)}
        autoFocus
      />
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Template Type</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={templateType}
          onChange={handleChange}
          label="Template Type"
        >
          {createMenuItems()}
        </Select>
      </FormControl>
      <FormGroup>
      <FormControlLabel
          control={<Switch
            checked={randomPosts}
            onChange={handleRandomPosts}
            color="primary"
            name="randomPosts"
            inputProps={{ 'aria-label': 'Render ramdom posts on socail media page' }}
          />}
          label="Enable random post rendering"
        />
      {/* <Typography component="h6">
        Please provide additional permissions?
      </Typography> */}
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
      <FormControlLabel
        control={<Switch
          checked={requiredQualtricsId}
          onChange={handleQualtricsId}
          color="primary"
          name="requiredQualtricsId"
          inputProps={{ 'aria-label': 'Request qualtrics code checkbox' }}
        />}
        label="Require Qualtrics Id"
      />
      </FormGroup>
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

export default Template;