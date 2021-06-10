import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getQuestions } from '../../../../../services/questions-service';
import { createOpentext } from '../../../../../services/user-answer-service';
import { Button, TextField } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import useStyles from '../../../../style';
import { showErrorSnackbar, showInfoSnackbar, showSuccessSnackbar } from '../../../../../actions/snackbar';
import { updateFlowActiveState } from '../../../../../actions/flowState';
import "./Opentext.css";
import { IconChevronRight } from '@tabler/icons';
import Progress from '../../../../Common/Progress';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../../constants';
import RenderRichTextArea from '../../../../Common/UserCommon/RenderRichTextArea';

const Opentext = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [OpentextQuestions, setOpentextQuestions] = useState(null);
  const [opentextResponse, setOpentextResponse] = useState(null);
  const [normalizedReq, setNoramlizedReq] = useState([]);
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    try {
      const { data: response } = await getQuestions(data._id, data.type);
      const resultArr = response.result || null;
      if (resultArr) {
        let normalizeOpenTextData = {};
        let normalizeRequiredData = [];
        // maintain the response object with key as questionId
        for (let i = 0; i < resultArr.length; i++) {
          const currentItem = resultArr[i];
          normalizeOpenTextData[currentItem._id] = '';
          if (currentItem.required) {
            normalizeRequiredData.push(currentItem._id);
          }
        }
        await setNoramlizedReq(normalizeRequiredData);
        await setOpentextResponse(normalizeOpenTextData);
        await setOpentextQuestions(resultArr);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch(showErrorSnackbar((translations?.error) || USER_TRANSLATIONS_DEFAULT.ERROR));
    }
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    setIsLoading(true);
    fetch();
  }, []);

  const checkAndFilterRequired = () => {
    for (let i = 0; i < normalizedReq.length; i++) {
      if (!opentextResponse[normalizedReq[i]]) return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      // check if all the required answers were submitted
      if (checkAndFilterRequired()) {
        await createOpentext({ opentext: opentextResponse });
        dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
        dispatch(updateFlowActiveState());
      } else {
        dispatch(showInfoSnackbar((translations?.['please_answer_all_required_questions_to_continue.']) || USER_TRANSLATIONS_DEFAULT.ENTER_REQUIRED_INFO));
      }
    } catch (error) {
      dispatch(showErrorSnackbar((translations?.error) || USER_TRANSLATIONS_DEFAULT.ERROR));
    }
  };

  const handleChange = (_id, e) => {
    setOpentextResponse({ ...opentextResponse, [_id]: e.target.value })
  };

  return (
    <>
      {data?.richText && <RenderRichTextArea richText={data.richText}/>}
      {OpentextQuestions && OpentextQuestions.length > 0 ? OpentextQuestions.map((question, index) => (
        <div key={index}>
          <br/>
          <p className="questionText">{question.questionText || ""}</p>
          <TextField
            className={classes.center}
            value={opentextResponse ? opentextResponse[question._id] : ''}
            label={(translations?.type_your_answer_here) || USER_TRANSLATIONS_DEFAULT.TYPE_YOUR_ANSWER_HERE}
            onChange={(e) => handleChange(question._id, e)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
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

export default Opentext;
