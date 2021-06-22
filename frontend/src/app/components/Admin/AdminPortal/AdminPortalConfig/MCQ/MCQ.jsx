import { Button, TextField, IconButton, Container, Tooltip, Grid, Switch } from '@material-ui/core';
import { useState } from 'react';
import { create } from "../../../../../services/questions-service";
import cloneDeep from 'lodash/cloneDeep';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../../style';
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../../actions/snackbar';
import { TEMPLATE, MCQ_PAGE } from '../../../../../constants';
import RichTextArea from '../../../../Common/AdminCommon/RichTextArea';
import { checkIfEmptyRichText } from '../../../../../utils';
import { IconCirclePlus, IconTrash, IconDeviceFloppy } from '@tabler/icons';
import clsx from 'clsx';

const MCQ = () => {
  const [clearRichText, setClearRichText] = useState(false);
  const [richText, setRichText] = useState(null);
  const [OpenTextArr, setOpenTextArr] = useState([]);
  const [pageName, setPageName] = useState("");

	const dispatch = useDispatch();
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

  const resetValues = () => {
    setClearRichText(true);
    setOpenTextArr([]);
    setPageName("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    const mcq = {
      templateId,
      type: 'MCQ',
      pageName: pageName,
      pageQuestionArr: OpenTextArr,
      richText: checkIfEmptyRichText(richText) ? null : richText,
    };
    try {
      if (OpenTextArr.length > 0) {
        await create(mcq);
        dispatch(showSuccessSnackbar(MCQ_PAGE.SUCCESSFULLY_CREATED_MULTIPLE_CHOICE_PAGE));
        resetValues();
      } else {
        dispatch(showInfoSnackbar(MCQ_PAGE.PLEASE_ENTER_A_VALID_RESPONSE));
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

  const handleCustomField = async (customField, type, event) => {
    event.preventDefault();
    if (type === 'required' || type === 'multiResponse') customField[type] = event.target.checked;
    else customField[type] = event.target.value;
    // deep copy OpenTextArr
    let newOpenTextArr = cloneDeep(OpenTextArr);
    // make this new OpenTextArr
    await setOpenTextArr(newOpenTextArr);
  };

  const addQuestion = async () => {
    let obj = {
      questionText: "",
      required: false,
      order: "",
      multiResponse: false,
      mcqOptions: []
    };
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr.push(obj);
    await setOpenTextArr(newOpenTextArr);
  }

  const addMcqOption = async (questionIndex) => {
    let obj = {
      optionOrder: "",
      optionText: "",
    };
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr[questionIndex].mcqOptions.push(obj);
    await setOpenTextArr(newOpenTextArr);
  }

  const removeQuestion = async (questionIndex) => {
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr.splice(questionIndex, 1);
    await setOpenTextArr(newOpenTextArr);
  }

  const removeMcqOption = async (questionIndex, optionIndex) => {
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr[questionIndex].mcqOptions.splice(optionIndex, 1);
    await setOpenTextArr(newOpenTextArr);
  }

  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }

  return (
    <Container component="main" maxWidth="lg" className={classes.card}>
      <h1>Multiple-choice Page</h1>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          margin="normal"
          required
          fullWidth
          value={pageName}
          label={MCQ_PAGE.PROVIDE_A_UNIQUE_PAGE_NAME}
          onChange={({ target }) => setPageName(target.value)}
          autoFocus
        />
        
        <RichTextArea setRichText={setRichText} clearRichText={clearRichText}/>

        <Button
          variant="contained"
          component="label"
          onClick={() => addQuestion()} className={classes.marginTenPx}
          startIcon={<IconCirclePlus />}
        >
          CREATE NEW QUESTION
        </Button>
        {OpenTextArr?.length > 0 ? OpenTextArr.map((question, questionIndex) => (
          <div key={questionIndex} className={classes.card}>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <TextField
                  className={classes.textGrid}
                  variant="outlined"
                  margin="normal"
                  required
                  value={question.questionText}
                  label={MCQ_PAGE.TYPE_QUESTION_HERE}
                  onChange={(e) => handleCustomField(question, 'questionText', e)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  id="standard-number"
                  onChange={(e) => handleCustomField(question, 'order', e)}
                  inputProps={{ min: 0, max: 65535, step: 1 }}
                  type="number"
                  label="Order"
                />
              </Grid>
              <Grid item xs={1} className={classes.flexCenter}>
                <Tooltip title="Response required?">
                  <Switch
                    checked={question.required}
                    onChange={(e) => handleCustomField(question, 'required', e)}
                    color="primary"
                    name="requiredField"
                    inputProps={{ 'aria-label': 'Response required' }}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={1} className={classes.flexCenter}>
                <Tooltip title="Allow multiple responses?">
                  <Switch
                    checked={question.multiResponse}
                    onChange={(e) => handleCustomField(question, 'multiResponse', e)}
                    color="primary"
                    name="allowMultipleResponses"
                    inputProps={{ 'aria-label': 'Allow multiple responses' }}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={1} className={classes.floatRight, classes.flexCenter}>
                <Tooltip title="Delete question">
                  <Button
                    aria-label="delete question"
                    className={classes.floatRight}
                    onClick={() => removeQuestion(questionIndex)}
                    >
                    <IconTrash />
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={12} >
                <Button
                  style={{ marginLeft: '10px'}}
                  variant="contained"
                  component="label"
                  onClick={() => addMcqOption(questionIndex)}
                  startIcon={<IconCirclePlus />}
                >
                  ADD RESPONSE OPTION
                </Button>
              </Grid>
            </Grid>
              {OpenTextArr[questionIndex].mcqOptions && 
                OpenTextArr[questionIndex].mcqOptions.length > 0 ? 
                OpenTextArr[questionIndex].mcqOptions.map((option, mcqOptionIndex) => (
                  <Grid key={mcqOptionIndex} container spacing={1}>
                    <Grid item xs={10}>
                      <TextField
                        className={classes.textGrid}
                        variant="outlined"
                        margin="normal"
                        required
                        value={option.optionText}
                        label={MCQ_PAGE.TYPE_RESPONSE_OPTION_HERE}
                        onChange={(e) => handleCustomField(option, 'optionText', e)}
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        id="standard-number"
                        onChange={(e) => handleCustomField(option, 'optionOrder', e)}
                        inputProps={{ min: 0, max: 65535, step: 1 }}
                        type="number"
                        label="Order"
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.floatRight, classes.flexCenter}>
                      <Tooltip title="Delete Mcq Option">
                        <Button
                          aria-label="Delete Mcq Option"
                          className={classes.floatRight}
                          onClick={() => removeMcqOption(questionIndex, mcqOptionIndex)}
                          >
                          <IconTrash />
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
              )) : null}
          </div>
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
  )
}

export default MCQ;
