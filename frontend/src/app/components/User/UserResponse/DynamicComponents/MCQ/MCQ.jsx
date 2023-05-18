import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getQuestions } from '../../../../../services/questions-service';
import { createMCQ } from '../../../../../services/user-answer-service';
import { Button, RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox } from '@material-ui/core';
import { Navigate } from 'react-router-dom';
import useStyles from '../../../../style';
import { showErrorSnackbar, showInfoSnackbar, showSuccessSnackbar } from '../../../../../actions/snackbar';
import { updateFlowActiveState } from '../../../../../actions/flowState';
import "./MCQ.css";
import { IconChevronRight } from '@tabler/icons-react';
import Progress from '../../../../Common/Progress';
import { USER_TRANSLATIONS_DEFAULT, WINDOW_GLOBAL } from '../../../../../constants';
import RenderRichTextArea from '../../../../Common/UserCommon/RenderRichTextArea';

const MCQ = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mcqQuestions, setMcqQuestions] = useState(null);
  const [mcqRadioResponse, setMcqRadioResponse] = useState(null);
  const [mcqCheckResponse, setMcqCheckResponse] = useState(null);
  const [normalizedReq, setNoramlizedReq] = useState([]);
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    try {
      const { data: response } = await getQuestions(data._id, data.type);
      const resultArr = response.result || null;
      if (resultArr) {
        let normalizeRadioData = {};
        let normalizeCheckboxData = {};
        let normalizeRequiredData = [];
        // maintain the response object with key as questionId
        for (let i = 0; i < resultArr.length; i++) {
          const currentItem = resultArr[i];
          // question requires multiresponse
          if (currentItem.multiResponse) {
            normalizeCheckboxData[currentItem._id] = {};
            for (let j = 0; j < currentItem.mcqOption.length; j++) {
              normalizeCheckboxData[currentItem._id][currentItem.mcqOption[j]._id] = false;
            }
          }
          else normalizeRadioData[currentItem._id] = '';
          // if question is required, only then push it to the normalize required object
          if (currentItem.required) {
            normalizeRequiredData.push({
              questionId: currentItem._id,
              multiResponse: currentItem.multiResponse
            });
          }
        }
        await setMcqRadioResponse(normalizeRadioData);
        await setMcqCheckResponse(normalizeCheckboxData);
        await setNoramlizedReq(normalizeRequiredData);
        // set this last
        await setMcqQuestions(resultArr);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch(showErrorSnackbar((translations?.error) || USER_TRANSLATIONS_DEFAULT.ERROR));
    }
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Navigate to="/" />;
    setIsLoading(true);
    fetch();
    window.onbeforeunload = function() {
      return WINDOW_GLOBAL.RELOAD_ALERT_MESSAGE;
    };
  }, []);

  const checkAndFilterRequired = () => {
    for (let i = 0; i < normalizedReq.length; i++) {
      const normalItem = normalizedReq[i];
      if (normalItem.multiResponse) {
        const selectAllOptions = mcqCheckResponse[normalItem.questionId];
        let count = 0;
        for (const [, value] of Object.entries(selectAllOptions)) {
          if (value) count++;
        }
        if (count < 1) return false;
      } else {
        // it is not a multi response object, i.e. radio
        if (!mcqRadioResponse[normalItem.questionId]) return false;
      }
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // check if all the required answers were submitted
      if (checkAndFilterRequired()) {
        const mcqResponse = [];
        // form the mcq response
        for (const [key, value] of Object.entries(mcqRadioResponse)) {
          mcqResponse.push({
            [key]: value
          });
        }
        for (const [questionKey, questionValue] of Object.entries(mcqCheckResponse)) {
          for (const [optionKey, optionValue] of Object.entries(questionValue)) {
            // only push the pair where option is selected
            if (optionValue) {
              mcqResponse.push({
                [questionKey]: optionKey
              });
            }
          }
        }
        if (mcqResponse.length > 0) await createMCQ({ mcq: mcqResponse });
        dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
        dispatch(updateFlowActiveState());
      } else {
        dispatch(showInfoSnackbar((translations?.['please_answer_all_required_questions_to_continue.']) || USER_TRANSLATIONS_DEFAULT.ENTER_REQUIRED_INFO));
      }
    } catch (error) {
      dispatch(showErrorSnackbar((translations?.error) || USER_TRANSLATIONS_DEFAULT.ERROR));
    }
  };

  const handleRadioChange = (_id, e) => {
    setMcqRadioResponse({ ...mcqRadioResponse, [_id]: e.target.value })
  };

  const handleCheckBoxChange = (questionId, optionId, e) => {
    setMcqCheckResponse({ ...mcqCheckResponse, [questionId]: {
      ...mcqCheckResponse[questionId],
      [optionId]: e.target.checked
    }});
  };

  return (
    <>
      {data?.richText && <RenderRichTextArea richText={data.richText}/>}

      {mcqQuestions?.length > 0 ? mcqQuestions.map((question, index) => (
        <div key={index}>
          <br/>
          <p className="mcqText">{question.questionText}</p>

          {!question.multiResponse &&
            <RadioGroup
              aria-label="MCQ Questions"
              name="MCQ"
              value={mcqRadioResponse?.[question._id] || ''}
              onChange={e => handleRadioChange(question._id, e)} >
              {question.mcqOption?.length > 0 ? question.mcqOption.map((option, optionIndex) => (
                <FormControlLabel
                  key={option._id}
                  value={option._id}
                  control={<Radio color="primary" />}
                  label={<p className="mcqText">{option.optionText}</p>}
                />
              )): null}
            </RadioGroup>
          }

          {question.multiResponse &&
            <FormGroup
              aria-label="MCQ Questions"
              name="MCQ" >
              {question.mcqOption?.length > 0 ? question.mcqOption.map((option, optionIndex) => (
                <FormControlLabel
                  key={option._id}
                  control={
                    <Checkbox
                      color="primary"
                      checked={mcqCheckResponse?.[question._id][option._id] || false}
                      onChange={e => handleCheckBoxChange(question._id, option._id, e)}
                    />
                  }
                  label={<p className="mcqText">{option.optionText}</p>}
                />
              )): null}
            </FormGroup>
          }
        </div>
      )) : null}
      {isLoading && <Progress />}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className={classes.submit}
        endIcon={<IconChevronRight />}
      >
        {translations?.next || "NEXT"}
      </Button>
   </>
  )
};

export default MCQ;
