import {
  Button,
  Switch,
  FormControl,
  TextField,
  Container,
  Tooltip,
  Fab,
  MenuItem,
  IconButton,
  InputLabel,
  Select,
  Grid,
  Box
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from '../../../style';
import { useSelector, useDispatch } from "react-redux";
import { create } from '../../../../services/register-service';
import { Redirect } from 'react-router-dom';
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../actions/snackbar';
import {
  TEMPLATE,
  REGISTER_PAGE,
  REGISTER_PAGE_CUSTOM_FIELDS,
  REGISTER_PAGE_CUSTOM_REFERENCES
} from '../../../../constants';
import cloneDeep from 'lodash/cloneDeep';

const Register = () => {
  const [customFieldArr, setCustomFieldArr] = useState([]);
  const [pageName, setPageName] = useState("");

  const [customFields, setCustomFields] = useState([]);
  const [customRefs, setCustomRefs] = useState([]);

	const dispatch = useDispatch();
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

  useEffect(() => {
    // create custom fields html
    let customFieldItems = [];
    for (const [key, value] of Object.entries(REGISTER_PAGE_CUSTOM_FIELDS)) {
      customFieldItems.push(<MenuItem value={key} key={key}>{value}</MenuItem>)
    }
    setCustomFields(customFieldItems);

    // create custom references html
    let customRefItems = [];
    for (const [key, value] of Object.entries(REGISTER_PAGE_CUSTOM_REFERENCES)) {
      customRefItems.push(<MenuItem value={key} key={key}>{value}</MenuItem>)
    }
    setCustomRefs(customRefItems);
  }, []);

  const resetValues = () => {
    setCustomFieldArr([]);
    setPageName("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    const register = {
      templateId: templateId,
      name: pageName,
      type: "REGISTER",
      register: customFieldArr
    };

    try {
      if (customFieldArr.length > 0) {
        await create(register);
        dispatch(showSuccessSnackbar(REGISTER_PAGE.SUCCESSFULLY_CREATED_REGISTRATION_PAGE));
        resetValues();
      } else {
        dispatch(showInfoSnackbar(REGISTER_PAGE.PLEASE_ENTER_A_VALID_RESPONSE));
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
    return <Redirect to="/admin" />;
  }

  const addCustomField = async () => {
    let obj = {
      type: "",
      displayName: "",
      referenceName: "",
      required: false,
      response: false,
      order: ""
    };
    let newCustomFieldArr = cloneDeep(customFieldArr);
    newCustomFieldArr.push(obj);
    await setCustomFieldArr(newCustomFieldArr);
  }

  const removeField = async (fieldIndex) => {
    let newCustomFieldArr = cloneDeep(customFieldArr);
    newCustomFieldArr.splice(fieldIndex, 1);
    await setCustomFieldArr(newCustomFieldArr);
  }

  const handleCustomField = async (customField, type, event) => {
    event.preventDefault();
    if (type === 'required' || type === 'response') customField[type] = event.target.checked;
    else customField[type] = event.target.value;
    // deep copy OpenTextArr
    let newCustomFieldArr = cloneDeep(customFieldArr);
    // make this new OpenTextArr
    await setCustomFieldArr(newCustomFieldArr);
  };

  return (
    <>
    <Box component="span" className={classes.note} display="block">
      For now, <b>Store Response to Database</b> doesn't work. User Responses are only saved in browser and are discarded after they finish. 
    </Box>
    <Container component="main" maxWidth="lg" className={classes.card}>
      <form onSubmit={handleSubmit}>
        <TextField
            className={classes.marginBottom}
            margin="normal"
            required
            fullWidth
            value={pageName}
            label={REGISTER_PAGE.PROVIDE_A_UNIQUE_PAGE_NAME}
            onChange={({ target }) => setPageName(target.value)}
            autoFocus
          />
        <Tooltip title="Add Custom Field" aria-label="Add Custom Field" >
          <Fab color="primary" onClick={() => addCustomField()} className={classes.marginTenPx}>
            <AddIcon />
          </Fab>
        </Tooltip>

        {customFieldArr?.length > 0 ? customFieldArr.map((customField, customFieldIndex) => (
          <Container key={customFieldIndex} component="main" maxWidth="lg" className={classes.card}>

          <Grid container>
            <Grid item xs={8}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={customField.displayName}
                label={"Display Name"}
                onChange={(e) => handleCustomField(customField, 'displayName', e)}
                autoFocus
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                id="standard-number"
                onChange={(e) => handleCustomField(customField, 'order', e)}
                inputProps={{ min: 0, max: 65535, step: 1 }}
                type="number"
                label="order"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={1} className={classes.flexCenter} >
              <Tooltip title="Field Required?">
                <Switch
                  checked={customField.required}
                  onChange={(e) => handleCustomField(customField, 'required', e)}
                  color="primary"
                  name="requiredField"
                  inputProps={{ 'aria-label': 'Field Required' }}
                />
            </Tooltip>
            </Grid>
            <Grid item xs={1} className={classes.flexCenter} >
              <Tooltip title="Store Response to Database?">
                <Switch
                  checked={customField.response}
                  onChange={(e) => handleCustomField(customField, 'response', e)}
                  color="primary"
                  name="responseField"
                  inputProps={{ 'aria-label': 'Field Response Required' }}
                />
            </Tooltip>
            </Grid>
            <Grid item xs={1} className={classes.floatRight, classes.flexCenter}>
              <Tooltip title="Delete question">
                <IconButton aria-label="delete question" className={classes.floatRight} onClick={() => removeField(customFieldIndex)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            </Grid>
          <br></br>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">{"Please select the Custom Field Type"}</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              className={classes.marginBottom}
              value={customField.type}
              onChange={(e) => handleCustomField(customField, 'type', e)}
              label={"Please select the Custom Field Type"}
            >
              {customFields}
            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">{"Please select the Custom Field Reference Name"}</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              className={classes.marginBottom}
              value={customField.referenceName}
              onChange={(e) => handleCustomField(customField, 'referenceName', e)}
              label={"Please select the Custom Field Reference Name"}
            >
              {customRefs}
            </Select>
          </FormControl>

        </Container>
      )) : null}
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
    </Container>
    </>
  )
}

export default Register;
