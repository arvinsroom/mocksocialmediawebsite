import {
  Button,
  Switch,
  FormControl,
  TextField,
  Container,
  Tooltip,
  MenuItem,
  InputLabel,
  Select,
  Grid
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import useStyles from '../../../../style';
import { checkIfEmptyRichText } from '../../../../../utils';
import { useSelector, useDispatch } from "react-redux";
import { create } from '../../../../../services/register-service';
import RichTextArea from '../../../../Common/AdminCommon/RichTextArea';
import { Navigate } from 'react-router-dom';
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../../actions/snackbar';
import {
  TEMPLATE,
  REGISTER_PAGE,
  REGISTER_PAGE_CUSTOM_FIELDS,
  REGISTER_PAGE_CUSTOM_REFERENCES
} from '../../../../../constants';
import cloneDeep from 'lodash/cloneDeep';
import { IconCirclePlus, IconTrash, IconDeviceFloppy } from '@tabler/icons-react';
import clsx from 'clsx';

const Register = () => {
  const [customFieldArr, setCustomFieldArr] = useState([]);
  const [pageName, setPageName] = useState("");
  const [clearRichText, setClearRichText] = useState(false);
  const [richText, setRichText] = useState(null);

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
    setClearRichText(true);
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
      register: customFieldArr,
      richText: checkIfEmptyRichText(richText) ? null : richText,
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
    return <Navigate to="/admin" />;
  }

  const addCustomField = async () => {
    let obj = {
      type: "",
      displayName: "",
      referenceName: "",
      required: false,
      response: false,
      order: 0
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
    <Container component="main" maxWidth="lg" className={classes.card}>
      <h1>Registration Page</h1>
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
        <RichTextArea setRichText={setRichText} clearRichText={clearRichText}/>

        <Button
          variant="contained"
          component="label"
          aria-label="Add field"
          onClick={() => addCustomField()} className={classes.marginTenPx}
          startIcon={<IconCirclePlus />}
        >
          CREATE FIELD
        </Button>

        {customFieldArr?.length > 0 ? customFieldArr.map((customField, customFieldIndex) => (
          <Container key={customFieldIndex} component="main" maxWidth="lg" className={classes.card}>

          <Grid container spacing={1}>
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
                label="Order"
                fullWidth
              />
            </Grid>
            <Grid item xs={1} className={classes.flexCenter} >
              <Tooltip title="Field required?">
                <Switch
                  checked={customField.required}
                  onChange={(e) => handleCustomField(customField, 'required', e)}
                  color="primary"
                  name="requiredField"
                  inputProps={{ 'aria-label': 'Field required' }}
                />
            </Tooltip>
            </Grid>
            <Grid item xs={1} className={classes.flexCenter} >
              <Tooltip title="Store response to database?">
                <Switch
                  checked={customField.response}
                  onChange={(e) => handleCustomField(customField, 'response', e)}
                  color="primary"
                  name="responseField"
                  inputProps={{ 'aria-label': 'Store response to database' }}
                />
            </Tooltip>
            </Grid>
            <Grid item xs={1} className={`${classes.floatRight} ${classes.flexCenter}`}>
              <Tooltip title="Delete field">
                <Button
                  aria-label="Delete field"
                  className={classes.floatRight}
                  onClick={() => removeField(customFieldIndex)}
                  >
                  <IconTrash />
                </Button>
              </Tooltip>
            </Grid>
            </Grid>
          <br></br>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">{"Field Type"}</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              className={classes.marginBottom}
              value={customField.type}
              onChange={(e) => handleCustomField(customField, 'type', e)}
              label={"Field Type"}
            >
              {customFields}
            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">{"Associated Variable"}</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              className={classes.marginBottom}
              value={customField.referenceName}
              onChange={(e) => handleCustomField(customField, 'referenceName', e)}
              label={"Associated Variable"}
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
        startIcon={<IconDeviceFloppy />}
        className={clsx(classes.submit, classes.widthFitContent)}
      >
        Save
      </Button>
    </form>
    </Container>
    </>
  )
}

export default Register;
