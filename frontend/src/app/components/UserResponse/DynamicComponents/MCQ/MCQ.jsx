import { useEffect, useState } from "react";
import { getQuestions } from "../../../../services/questions-service";
import { createMCQ } from "../../../../services/user-answer-service";
import { Button, RadioGroup, Container, FormControlLabel, Radio } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showInfoSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { updateFlowActiveState } from '../../../../actions/flowState';
import "./MCQ.css";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Progress from '../../../Progress';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../constants';

const MCQ = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mcqQuestions, setMcqQuestions] = useState(null);
  const [mcqResponse, setMcqResponse] = useState(null);
  const [required, setRequired] = useState([]);
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);

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
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    setIsLoading(true);
    fetch();
  }, []);

  const checkAndFilterRequired = () => {
    for (let i = 0; i < required.length; i++) {
      if (!mcqResponse[required[i]]) return false;
    }
    // here we can remove the empty id's
    return true;
  };

  const handleClick = async e => {
    e.preventDefault();
    
    try {
      // check if all the required answers were submitted
      if (checkAndFilterRequired()) {
        await createMCQ({ mcq: mcqResponse });
        dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
        dispatch(updateFlowActiveState());
      } else {
        dispatch(showInfoSnackbar((translations?.['please_answer_all_required_questions_to_continue.']) || USER_TRANSLATIONS_DEFAULT.ENTER_REQUIRED_INFO));
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
      <Container component="main" maxWidth="md" className={classes.card}>
        {mcqQuestions && mcqQuestions.length > 0 ? mcqQuestions.map((question, index) => (
          <Container component="main" maxWidth="md" key={index} className={classes.card}>
            <p className="mcqText">{question.questionText}</p>
            <RadioGroup aria-label="MCQ Questions" name="MCQ" value={mcqResponse ? mcqResponse[question._id] : ''} onChange={e => handleChange(question._id, e)}>
            {question.mcqOption && question.mcqOption.length > 0 ? question.mcqOption.map((option, optionIndex) => (
              <FormControlLabel key={option._id} value={option._id} control={<Radio color="primary" />} label={<p className="mcqText">{option.optionText}</p>} />
            )): null}
            </RadioGroup>
          </Container>
        )) : null}
        {isLoading && <Progress />}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ float: 'right', width: '25%'}}
          onClick={handleClick}
          className={classes.submit}
        >
          <ArrowForwardIosIcon style={{ fontSize: 15 }} />
        </Button>
      </Container>
   </>
  )
};

export default MCQ;
