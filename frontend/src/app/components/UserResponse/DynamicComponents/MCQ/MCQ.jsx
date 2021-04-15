import { useEffect, useState } from "react";
import { getQuestions } from "../../../../services/questions-service";
import { createMCQ } from "../../../../services/user-answer-service";
import { Button, FormControl, RadioGroup, Card, FormControlLabel, FormLabel, Radio, Divider } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { updateFlowDisabledState } from '../../../../actions/flowState';
import "./MCQ.css";

const MCQ = ({ data }) => {

  const [mcqQuestions, setMcqQuestions] = useState(null);
  const [mcqResponse, setMcqResponse] = useState(null);
  const [required, setRequired] = useState([]);
  const { isLoggedInUser } = useSelector(state => state.userAuth);

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    const ret = await getQuestions(data._id, data.type);
    const resultArr = ret.data.result;
    if (resultArr) {
      await setMcqQuestions(ret.data.result);
      let obj = {};
      let reqObj = [];
      // maintain the response object with key as questionId
      for (let i = 0; i < resultArr.length; i++) {
        obj[resultArr[i]._id] = '';
        // if question is required, then push it to the required object where id is the value
        if (resultArr[i].required) {
          reqObj.push(resultArr[i]._id);
        }
      }
      await setRequired(reqObj);
      await setMcqResponse(obj);
    }
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    fetch();
  }, []);

  const resetValues = () => {
    setMcqResponse(null);
  };

  const checkAndFilterRequired = () => {
    for (let i = 0; i < required.length; i++) {
      if (!mcqResponse[required[i]]) return false;
    }
    // here we can remove the empty id's
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      // check if all the required answers were submitted
      if (checkAndFilterRequired()) {
        await createMCQ({ mcq: mcqResponse });
        dispatch(showSuccessSnackbar("Success! Your MCQ answer(s) were saved! Please follow to the next Page!"));
        resetValues();
        dispatch(updateFlowDisabledState());
      } else {
        dispatch(showErrorSnackbar("Error! Please answer required questions!"));
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
      <form onSubmit={handleSubmit}>
      {mcqQuestions && mcqQuestions.length > 0 ? mcqQuestions.map((question, index) => (
          // <Card key={index} className="eachQuestion">
          <div key={index} className={classes.form}>
            <FormControl component="fieldset" key={question._id}>
              <FormLabel component="legend">{question.questionText} {question.required ? "(Required)" : "(Not Required)"}</FormLabel>
            </FormControl>
            <RadioGroup aria-label="MCQ Questions" name="MCQ" value={mcqResponse ? mcqResponse[question._id] : ''} onChange={e => handleChange(question._id, e)}>
            {question.mcqOption && question.mcqOption.length > 0 ? question.mcqOption.map((option, optionIndex) => (
              <FormControlLabel key={option._id} value={option._id} control={<Radio color="primary" />} label={option.optionText} />
            )): null}
            </RadioGroup>
            <Divider className={classes.divider}/>
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
   </>
  )
};

export default MCQ;
