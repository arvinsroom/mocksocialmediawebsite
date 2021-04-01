import { getUserFinishDetails } from '../../../../services/finish-service';
import { useEffect, useState } from "react";
import { Button, TextField, Card, Link, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import "./Finish.css";

const Finish = ({ data }) => {
  const [finishObj, setFinishObj] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const dispatch = useDispatch();
  const classes = useStyles();
  
  const fetch = async () => {
    const ret = await getUserFinishDetails(data._id);
    const obj = ret.data.data || null;// redirection Link and text to render
    const resId = ret.data.userResponse;

    await setFinishObj(obj);
    await setResponseId(resId);
  };

  useEffect(() => {
    fetch();
  }, []);

  const getRedirectionLink = (link) => {
    return link.startsWith("http://") || link.startsWith("https://") ?
      link : `https://${link}`
  };

  return (
   <>
    <Card className="finish">
      {finishObj ? 
        <div className="finishTop">
          <TextField
            className={classes.center}
            id="standard-disabled"
            disabled={true}
            defaultValue={finishObj.text ? finishObj.text : ""}
          />
        </div>
      : null}

        <div className="finishBottom">
          {/* <Typography variant="h6" className={classes.title}>
              This is your Response ID, please copy and store it somewhere!
          </Typography> */}
          {responseId ?
            <TextField
            variant="outlined"
            className={classes.center}
            defaultValue={responseId ? responseId : ""}
            disabled={true}
            label="This is your response Id for further study!"
          /> : null}
        </div>

        {finishObj ? 
          <div className="finishTopLink">
            <Link href={getRedirectionLink(finishObj.redirectionLink ? finishObj.redirectionLink : '')} rel="noopener noreferrer" target="_blank">
              Please Follow this Link!
            </Link>
          </div> : null}
      </Card>
    </>
  );
};

export default Finish;