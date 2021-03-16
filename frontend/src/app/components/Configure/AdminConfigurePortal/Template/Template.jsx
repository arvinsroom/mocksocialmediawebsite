import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, FormGroup, Snackbar } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { TEMPLATE_TYPES } from '../../../../constants';
import { create } from '../../../../services/template-service';

import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../Style/Style';

const Template = ({setTemplateId}) => {
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [randomPosts, setRandomPosts] = useState(false);
  const [requiredQualtricsId, setRequiredQualtricsId] = useState(false);
  const [permissions, setPermissions] = useState({
    requestAudio: false,
    requestVideo: false,
    requestCookies: false,
  });
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useSelector(state => state.auth);
  const classes = useStyles();

  // on first render check if user logged in, verify server
  useEffect(() => {
    // setMessage("");
    // setTimeout(() => {
    //   setTemplateId("testing id");
    // }, 3000);
  }, [])

  const resetValues = () => {
    setTemplateName("");
    setTemplateType("");
    setRandomPosts(false);
    setRequiredQualtricsId(false);
    setPermissions({
      requestAudio: false,
      requestVideo: false,
      requestCookies: false,
    })
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const template = {
      name: templateName,
      type: templateType,
      randomPosts,
      requestAudio: permissions.requestAudio,
      requestVideo: permissions.requestVideo,
      requestCookies: permissions.requestCookies,
      qualtricsId: requiredQualtricsId,
      flow: "",
    };
    try {
      const { data } = await create(template);
      if (data._id) {
        setTemplateId(data._id);
        setMessage("Template Successfully created!")
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

  if (!isLoggedIn) {
    return <Redirect to="/admin" />;
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
        value={templateName}
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
    <Snackbar open={open} autoHideDuration={2000} message={message}>
    </Snackbar>
    </div>
    </>
  )
}

export default Template;