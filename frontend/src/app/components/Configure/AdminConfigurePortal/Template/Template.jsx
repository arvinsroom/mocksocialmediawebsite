import { Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  FormGroup,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { TEMPLATE_TYPES } from '../../../../constants';
import { create } from '../../../../services/template-service';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { setTemplateId, getPrevTemplate, deletePrevTemplate } from "../../../../actions/template";
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { TEMPLATE } from '../../../../constants';

const Template = () => {
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [randomPosts, setRandomPosts] = useState(false);
  const [requiredQualtricsId, setRequiredQualtricsId] = useState(false);
  const [permissions, setPermissions] = useState({
    requestAudio: false,
    requestVideo: false,
    requestCookies: false,
  });
  const { isLoggedIn } = useSelector(state => state.auth);
  const { prevTemplates } = useSelector(state => state.template);
  const classes = useStyles();
  const dispatch = useDispatch();

  const retrivePrevTemplates = async () => {
    await dispatch(getPrevTemplate());
  }
  // on first render check if user logged in, verify server
  useEffect(() => {
    // on load fetch pevious templates
    retrivePrevTemplates();
  }, []);

  // handle this better
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
    };
    try {
      const { data } = await create(template);
      if (data._id) {
        // dispatch the event to save template Id in store
        await handleTemplateId(data._id, TEMPLATE.TEMPLATE_SUCCESS);
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

  const handleTemplateId = async (_id, message) => {
    await dispatch(setTemplateId(_id));
    resetValues();
    // fetch old templates
    await retrivePrevTemplates();
    dispatch(showSuccessSnackbar(message))
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

  const removeTemplate = async (index) => {
    await dispatch(deletePrevTemplate(index));
    await retrivePrevTemplates();
  };

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
        variant="contained"
        color="primary"
        fullWidth
        className={classes.submit}
      >
        Save
      </Button>
    </form>
    </div>

    <Box component="span" className={classes.note} display="block">
      <b>Note:</b> {TEMPLATE.TEMPLATE_DELETE_NOTE}
    </Box>
      <Table aria-label="Previous Template(s)">
        <TableHead>
          <TableRow>
            <TableCell className={classes.body, classes.head} align="center">Template ID</TableCell>
            <TableCell className={classes.body, classes.head} align="center">Template Name</TableCell>
            <TableCell className={classes.body, classes.head} align="center">Template Type</TableCell>
            <TableCell className={classes.body, classes.head} align="center">Delete</TableCell>
            <TableCell className={classes.body, classes.head} align="center">Set Current Template Id</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prevTemplates && prevTemplates.length > 0 ? prevTemplates.map((row) => (
            <TableRow key={row._id}>
              <TableCell align="center">{row._id}</TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.type}</TableCell>
              <TableCell align="center">
                <IconButton aria-label="delete template" onClick={() => removeTemplate(row._id)}>
                  <DeleteIcon color="primary" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton aria-label="set template" onClick={() => handleTemplateId(row._id, TEMPLATE.TEMPLATE_CURRENT_SELECT)}>
                  <AddIcon color="primary" />
                </IconButton>
              </TableCell>
            </TableRow>
          )) : null}
        </TableBody>
      </Table>
    </>
  )
}

export default Template;