import { Button, TextField, IconButton, Container, Tooltip, Fab, Grid, Switch } from '@material-ui/core';
import { useState } from 'react';
import { create } from "../../../../services/questions-service";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import cloneDeep from 'lodash/cloneDeep';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../actions/snackbar';
import { TEMPLATE, OPENTEXT_PAGE } from '../../../../constants';

const OpenText = () => {
  const [OpenTextArr, setOpenTextArr] = useState([]);
  const [pageName, setPageName] = useState("");

	const dispatch = useDispatch();
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

  const resetValues = () => {
    setOpenTextArr([]);
    setPageName("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }

    const openText = {
      templateId,
      type: 'OPENTEXT',
      pageName: pageName,
      pageQuestionArr: OpenTextArr
    };

    try {
      const { data } = await create(openText);
      if (data) {
        dispatch(showSuccessSnackbar(OPENTEXT_PAGE.SUCCESSFULLY_CREATED_OPENTEXT_PAGE));
        resetValues();
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

  // add the question text to the question object
  const handleQuestionText = async (question, event) => {
    event.preventDefault();
    question.questionText = event.target.value;
    // deep copy OpenTextArr
    let newOpenTextArr = cloneDeep(OpenTextArr);
    // make this new OpenTextArr
    await setOpenTextArr(newOpenTextArr);
  };

  // add required field to the question object
  const handleRequiredField = async (question, event) => {
    event.preventDefault();
    question.required = event.target.checked;
    // deep copy OpenTextArr
    let newOpenTextArr = cloneDeep(OpenTextArr);
    // make this new OpenTextArr
    await setOpenTextArr(newOpenTextArr);
  };

  const addQuestion = async () => {
    let obj = {
      questionText: "",
      required: false
    };
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr.push(obj);
    await setOpenTextArr(newOpenTextArr);
  }

  const removeQuestion = async (questionIndex) => {
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr.splice(questionIndex, 1);
    await setOpenTextArr(newOpenTextArr);
  }

  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }

  return (
    <Container component="main" maxWidth="lg" className={classes.card}>
      <form onSubmit={handleSubmit} className={classes.form}>
      <TextField
          margin="normal"
          required
          fullWidth
          value={pageName}
          label={OPENTEXT_PAGE.PROVIDE_A_UNIQUE_PAGE_NAME}
          onChange={({ target }) => setPageName(target.value)}
          autoFocus
        />
      <Tooltip title="Add Quesion" aria-label="Add Quesion" >
        <Fab color="primary" onClick={() => addQuestion()} className={classes.marginTenPx}>
          <AddIcon />
        </Fab>
      </Tooltip>
      {OpenTextArr?.length > 0 ? OpenTextArr.map((question, questionIndex) => (
        <div key={questionIndex} className={classes.rootText}>
          <Grid container spacing={3}>
            <Grid item xs={10}>
              <TextField
                className={classes.textGrid}
                variant="outlined"
                margin="normal"
                required
                value={question.questionText}
                label={OPENTEXT_PAGE.TYPE_QUESTION_HERE}
                onChange={(e) => handleQuestionText(question, e)}
                autoFocus
              />
            </Grid>
            <Grid item xs={1} className={classes.marginAuto}>
              <Tooltip title="Question Required?">
                <Switch
                  checked={question.required}
                  onChange={(e) => handleRequiredField(question, e)}
                  color="primary"
                  name="requiredField"
                  inputProps={{ 'aria-label': 'Question/Answer Required' }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={1} className={classes.floatRight}>
              <Tooltip title="Delete question">
                <IconButton aria-label="delete question" className={classes.floatRight} onClick={() => removeQuestion(questionIndex)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
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
  )
}

export default OpenText;
