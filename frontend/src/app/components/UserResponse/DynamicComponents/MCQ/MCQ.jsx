import { useEffect, useState } from "react";
import { getQuestions } from "../../../../services/questions-service";
import { createMCQ } from "../../../../services/user-answer-service";
import { Button, FormControl, RadioGroup, Card, FormControlLabel, FormLabel, Radio } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';

const MCQ = ({ data }) => {

  const [mcqQuestions, setMcqQuestions] = useState(null);
  const [mcqResponse, setMcqResponse] = useState(null);

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    const ret = await getQuestions(data._id, data.type);
    const resultArr = ret.data.result;
    if (resultArr) {
      await setMcqQuestions(ret.data.result);
      let obj = {};
      // maintain the response object with key as questionId
      for (let i = 0; i < resultArr.length; i++) {
        obj[resultArr[i]._id] = '';
      }
      await setMcqResponse(obj);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const resetValues = () => {
    setMcqResponse(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      const { data } = await createMCQ({ mcq: mcqResponse });
      if (data) {
        dispatch(showSuccessSnackbar("Success! Your MCQ answer(s) were saved! Please follow to the next Page!"));
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

  const handleChange = (_id, e) => {
    setMcqResponse({ ...mcqResponse, [_id]: e.target.value })
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.form}>
      {mcqQuestions && mcqQuestions.length > 0 ? mcqQuestions.map((question, index) => (
          <Card key={index} className={classes.rootText}>
            <FormControl component="fieldset" key={question._id}>
              <FormLabel component="legend">{question.questionText}</FormLabel>
                <RadioGroup aria-label="MCQ Questions" name="MCQ" value={mcqResponse ? mcqResponse[question._id] : ''} onChange={e => handleChange(question._id, e)}>
                {question.mcqOption && question.mcqOption.length > 0 ? question.mcqOption.map((option, optionIndex) => (
                  <FormControlLabel key={option._id} value={option._id} control={<Radio />} label={option.optionText} />
                )): null}
                </RadioGroup>
            </FormControl>
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
};

export default MCQ;
