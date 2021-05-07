import { useEffect, useState } from "react";
import { getQuestions } from "../../../../services/questions-service";
import { createOpentext } from "../../../../services/user-answer-service";
import { Button, TextField, Container } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showInfoSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { updateFlowActiveState } from '../../../../actions/flowState';
import "./Opentext.css";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Progress from '../../../Progress';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../constants';

const Opentext = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [OpentextQuestions, setOpentextQuestions] = useState(null);
  const [opentextResponse, setOpentextResponse] = useState(null);
  const [required, setRequired] = useState([]);
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    const ret = await getQuestions(data._id, data.type);
    const resultArr = ret.data.result;
    if (resultArr) {
      await setOpentextQuestions(ret.data.result);
      let obj = {};
      let reqObj = [];
      // maintain the response object with key as questionId
      for (let i = 0; i < resultArr.length; i++) {
        obj[resultArr[i]._id] = '';
        if (resultArr[i].required) {
          reqObj.push(resultArr[i]._id);
        }
      }
      await setRequired(reqObj);
      await setOpentextResponse(obj);
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
      if (!opentextResponse[required[i]]) return false;
    }
    // here we can remove the empty id's
    return true;
  };

  const handleClick = async e => {
    e.preventDefault();
    
    try {
      // check if all the required answers were submitted
      if (checkAndFilterRequired()) {
        await createOpentext({ opentext: opentextResponse });
        dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
        dispatch(updateFlowActiveState());
      } else {
        dispatch(showInfoSnackbar((translations?.please_answer_all_required_questions_to_continue) || USER_TRANSLATIONS_DEFAULT.ENTER_REQUIRED_INFO));
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
    setOpentextResponse({ ...opentextResponse, [_id]: e.target.value })
  };

  return (
    <>
      <Container component="main" maxWidth="md" className={classes.card}>
        {OpentextQuestions && OpentextQuestions.length > 0 ? OpentextQuestions.map((question, index) => (
          <Container component="main" maxWidth="md" key={index} className={classes.card}>
              <p classname="questionText">{question.questionText || ""}</p>
              <TextField
                className={classes.center}
                value={opentextResponse ? opentextResponse[question._id] : ''}
                label={(translations?.type_your_answer_here) || USER_TRANSLATIONS_DEFAULT.TYPE_YOUR_ANSWER_HERE}
                onChange={(e) => handleChange(question._id, e)}
                variant="outlined"
                margin="normal"
                fullWidth
              />
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

export default Opentext;
