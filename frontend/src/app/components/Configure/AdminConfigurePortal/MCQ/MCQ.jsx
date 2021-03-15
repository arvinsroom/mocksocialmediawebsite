import { Button, TextField, IconButton, Card, Tooltip, Fab, Grid, Switch } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { create } from "../../../../services/questions-service";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import cloneDeep from 'lodash/cloneDeep';

const MCQ = ({templateId}) => {
  const [OpenTextArr, setOpenTextArr] = useState([]);
  const [message, setMessage] = useState("");

  // on first render check if user logged in, verify server
  // useEffect(() => {
  //   setOpenTextArr(OpenTextArr)
  // }, [OpenTextArr])

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
      minWidth: 120,
      width: '100%'
    },
    root: {
      marginBottom: '20px'
    },
    floatRight: {
      float: 'right',
      margin: 'auto'
    },
    textGrid: {
      width: '95%',
      margin: '10px'
    },
    floatLeft: {
      float: 'left',
      margin: 'auto'
    },
    center: {
      width: '100%'
    },
    marginAuto: {
      margin: 'auto'
    },
    marginTenPx: {
      margin: '10px'
    },
    divider: {
      margin: 20
    }
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
    console.log('OpenTextArr: ', OpenTextArr);
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
    // console.log(event.target.checked);
    question.required = event.target.checked;
    // deep copy OpenTextArr
    let newOpenTextArr = cloneDeep(OpenTextArr);
    // make this new OpenTextArr
    await setOpenTextArr(newOpenTextArr);
  };

  // add required field to the question object
  const handleMcqOption = async (option, event) => {
    event.preventDefault();
    // console.log(event.target.checked);
    option.optionText = event.target.value;
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
      required: false,
      mcqOptions: []
    };
    let newOpenTextArr = cloneDeep(OpenTextArr);
    if (!newOpenTextArr[index].questions) {
      newOpenTextArr[index].questions = [obj]
    } else newOpenTextArr[index].questions.push(obj);
    await setOpenTextArr(newOpenTextArr);
  }

  const addMcqOption = async (index, questionIndex) => {
    let obj = {
      optionText: "",
    };
    let newOpenTextArr = cloneDeep(OpenTextArr);
    if (!newOpenTextArr[index].questions[questionIndex].mcqOptions) {
      newOpenTextArr[index].questions[questionIndex].mcqOptions = [obj]
    } else newOpenTextArr[index].questions[questionIndex].mcqOptions.push(obj);
    await setOpenTextArr(newOpenTextArr);
  }

  const removeQuestion = async (pgIndex, questionIndex) => {
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr[pgIndex].questions.splice(questionIndex, 1);
    await setOpenTextArr(newOpenTextArr);
  }

  const removeMcqOption = async (pgIndex, questionIndex, optionIndex) => {
    let newOpenTextArr = cloneDeep(OpenTextArr);
    newOpenTextArr[pgIndex].questions[questionIndex].mcqOptions.splice(optionIndex, 1);
    await setOpenTextArr(newOpenTextArr);
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
          <Card key={index} className={classes.root}>
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
              <div key={questionIndex} className={classes.root}>
                <Grid container spacing={4}>
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
                  <Grid item xs={12}>
                    <Tooltip title="Add MCQ Option">
                      <IconButton aria-label="Add MCQ Option" className={classes.floatLeft} onClick={() => addMcqOption(index, questionIndex)}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                  {OpenTextArr[index].questions[questionIndex].mcqOptions && 
                    OpenTextArr[index].questions[questionIndex].mcqOptions.length > 0 ? 
                    OpenTextArr[index].questions[questionIndex].mcqOptions.map((option, mcqOptionIndex) => (
                      <Grid key={mcqOptionIndex} container spacing={1}>
                        <Grid item xs={10}>
                          <TextField
                            className={classes.textGrid}
                            variant="outlined"
                            margin="normal"
                            required
                            value={option.optionText}
                            label="Please type in your mcq option below"
                            onChange={(e) => handleMcqOption(option, e)}
                            autoFocus
                          />
                        </Grid>
                        <Grid item xs={2} className={classes.floatRight}>
                          <Tooltip title="Delete Mcq Option">
                            <IconButton aria-label="Delete Mcq Option" className={classes.floatRight} onClick={() => removeMcqOption(index, questionIndex, mcqOptionIndex)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                  )) : null}
              </div>
            )) : null}
          </Card>
      )) : null}
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
   </>
  )
}

export default MCQ;
