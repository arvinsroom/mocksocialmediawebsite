import { useEffect, useState } from "react";
import { getQuestions } from "../../../../services/questions-service";
import { createOpentext } from "../../../../services/user-answer-service";
import { Button, TextField, Card } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';

const Opentext = ({ data }) => {

  const [OpentextQuestions, setOpentextQuestions] = useState(null);
  const [opentextResponse, setOpentextResponse] = useState(null);

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    const ret = await getQuestions(data._id, data.type);
    const resultArr = ret.data.result;
    if (resultArr) {
      await setOpentextQuestions(ret.data.result);
      let obj = {};
      // maintain the response object with key as questionId
      for (let i = 0; i < resultArr.length; i++) {
        obj[resultArr[i]._id] = '';
      }
      await setOpentextResponse(obj);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const resetValues = () => {
    setOpentextResponse(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      const { data } = await createOpentext({ opentext: opentextResponse });
      if (data) {
        dispatch(showSuccessSnackbar("Success! Your OPENTEXT answer(s) were saved! Please follow to the next Page!"));
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
    setOpentextResponse({ ...opentextResponse, [_id]: e.target.value })
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.form}>
      {OpentextQuestions && OpentextQuestions.length > 0 ? OpentextQuestions.map((question, index) => (
          <Card key={index} className={classes.rootText}>
            <TextField
              className={classes.center}
              id="standard-disabled"
              disabled={true}
              label={"Q" + (index+1).toString()}
              defaultValue={question.questionText}
            />
            <TextField
              className={classes.center}
              value={opentextResponse ? opentextResponse[question._id] : ''}
              label="Please provide your answer here"
              onChange={(e) => handleChange(question._id, e)}
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
