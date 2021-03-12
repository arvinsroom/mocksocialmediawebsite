import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { TEMPLATE_TYPES } from '../../../../constants';
import { makeStyles } from '@material-ui/core/styles';

const Template = () => {
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [message, setMessage] = useState("");
  const [randomPosts, setRandomPosts] = useState(false);

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
  }));

  const classes = useStyles();

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
    console.log('Template Name: ', templateName);
    console.log('Template Type: ', templateType);
    console.log('Enable Random posts: ', randomPosts);
  };

  const handleChange = (event) => {
    setTemplateType(event.target.value);
  };

  const handleRandomPosts = (e) => {
    setRandomPosts(e.target.checked);
  };

  const createMenuItems = () => {
    let menuItems = [];
    for (let item in TEMPLATE_TYPES) {
      menuItems.push(<MenuItem value={TEMPLATE_TYPES[item]} key={item}>{item}</MenuItem>)
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
      <FormControlLabel
          control={<Switch
            checked={randomPosts}
            onChange={handleRandomPosts}
            color="primary"
            name="randomPosts"
            inputProps={{ 'aria-label': 'Render Ramdom Posts on Socail Media Page' }}
          />}
          label="Enable random post rendering"
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