import { Button, TextField, IconButton, Card, Tooltip, Fab, Grid, Switch } from '@material-ui/core';
import { useState } from 'react';
import { create } from "../../../../services/questions-service";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import cloneDeep from 'lodash/cloneDeep';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { TEMPLATE, OPENTEXT_PAGE } from '../../../../constants';

const OpenText = () => {
  const [OpenTextArr, setOpenTextArr] = useState([]);

	const dispatch = useDispatch();
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

  const resetValues = () => {
    setOpenTextArr([]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!templateId) {
      dispatch(showErrorSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }

    const openText = {
      templateId,
      type: 'OPENTEXT',
      pageQuestionArr: OpenTextArr
    };

    try {
      const { data } = await create(openText);
      if (data) {
        dispatch(showSuccessSnackbar(OPENTEXT_PAGE.OPENTEXT_PAGE_SUCCESS));
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

  // BAD: maybe change in future
  const handlePageName = async (pg, event) => {
    event.preventDefault();
    // update the current object name
    pg.name = event.target.value;
    // deep copy OpenTextArr
    let newOpenTextArr = cloneDeep(OpenTextArr);
    // make this new OpenTextArr
    await setOpenTextArr(newOpenTextArr);
  }

  const addPage = async () => {
    let pageObj = {
      name: "",
      questions: []
    };
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr.push(pageObj);
    await setOpenTextArr(newOpenTextArr);
  }

  const removePage = async (index) => {
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr.splice(index, 1);
    await setOpenTextArr(newOpenTextArr);
  }

  const addQuestion = async (index) => {
    let obj = {
      questionText: "",
      required: false
    };
    let newOpenTextArr = cloneDeep(OpenTextArr);
    if (!newOpenTextArr[index].questions) {
      newOpenTextArr[index].questions = [obj]
    } else newOpenTextArr[index].questions.push(obj);
    await setOpenTextArr(newOpenTextArr);
  }

  const removeQuestion = async (pgIndex, questionIndex) => {
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr[pgIndex].questions.splice(questionIndex, 1);
    await setOpenTextArr(newOpenTextArr);
  }

  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.form}>
      <Tooltip title="Add Page" aria-label="Add Page">
        <Fab color="default" onClick={() => addPage()} className={classes.marginTenPx}>
          <AddIcon />
        </Fab>
      </Tooltip>
      {OpenTextArr && OpenTextArr.length > 0 ? OpenTextArr.map((pg, index) => (
          <Card key={index} className={classes.rootText}>
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <Tooltip title="Add Quesion" aria-label="Add Quesion" >
                  <Fab color="primary" onClick={() => addQuestion(index)} className={classes.marginTenPx}>
                    <AddIcon />
                  </Fab>
                </Tooltip>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  className={classes.center}
                  margin="normal"
                  required
                  value={pg.name}
                  label="Provide a unique page name"
                  onChange={(e) => handlePageName(pg, e)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={2} className={classes.floatRight}>
                <Tooltip title="Delete Page" aria-label="Delete Page">
                  <IconButton aria-label="delete page"  onClick={() => removePage(index)} className={classes.floatRight}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>

            </Grid>
            {OpenTextArr[index].questions && OpenTextArr[index].questions.length > 0 ? OpenTextArr[index].questions.map((question, questionIndex) => (
              <div key={questionIndex} className={classes.rootText}>
                <Grid container spacing={3}>
                  <Grid item xs={10}>
                    <TextField
                      className={classes.textGrid}
                      variant="outlined"
                      margin="normal"
                      required
                      value={question.questionText}
                      label="Please type in your question below"
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
                      <IconButton aria-label="delete question" className={classes.floatRight} onClick={() => removeQuestion(index, questionIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </div>
            )) : null}
          </Card>
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
   </>
  )
}

export default OpenText;
