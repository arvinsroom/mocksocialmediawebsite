import { useEffect, useState } from "react";
import { getQuestions } from "../../../../services/questions-service";
import { createOpentext } from "../../../../services/user-answer-service";
import { Button, TextField, Card } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { updateFlowDisabledState } from '../../../../actions/flowState';
import "./Opentext.css";

const Opentext = ({ data }) => {

  const [OpentextQuestions, setOpentextQuestions] = useState(null);
  const [opentextResponse, setOpentextResponse] = useState(null);
  const [required, setRequired] = useState([]);
  const { isLoggedInUser } = useSelector(state => state.userAuth);

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
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    fetch();
  }, []);

  const resetValues = () => {
    setOpentextResponse(null);
  };

  const checkAndFilterRequired = () => {
    for (let i = 0; i < required.length; i++) {
      if (!opentextResponse[required[i]]) return false;
    }
    // here we can remove the empty id's
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      // check if all the required answers were submitted
      if (checkAndFilterRequired()) {
        await createOpentext({ opentext: opentextResponse });
        dispatch(showSuccessSnackbar("Success! Your OPENTEXT answer(s) were saved! Please follow to the next Page!"));
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
    setOpentextResponse({ ...opentextResponse, [_id]: e.target.value })
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.form}>
      {OpentextQuestions && OpentextQuestions.length > 0 ? OpentextQuestions.map((question, index) => (
          <Card key={index} className="eachQuestion">
            <TextField
              className={classes.center}
              id="standard-disabled"
              disabled={true}
              defaultValue={question.required ? question.questionText + " (Required)" : question.questionText + " (Not Required)"}
            />
            <TextField
              className={classes.center}
              value={opentextResponse ? opentextResponse[question._id] : ''}
              label="Please provide your answer here"
              onChange={(e) => handleChange(question._id, e)}
              variant="outlined"
              margin="normal"
              fullWidth
            />
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

export default Opentext;
