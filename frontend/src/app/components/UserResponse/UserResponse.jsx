import { Button, FormControlLabel, FormGroup, Switch, FormControl, FormLabel, TextField, Toolbar, AppBar, Typography } from '@material-ui/core';
import React, { useState } from 'react';
// import { useState } from 'react';
import useStyles from '../style';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
// import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
// import { TEMPLATE, REGISTER_PAGE } from '../../../../constants';
import "./UserResponse.css";

import InfoPage from './DynamicComponents/InfoPage/InfoPage';
import Finish from './DynamicComponents/Finish/Finish';
import MCQ from './DynamicComponents/MCQ/MCQ';
import Opentext from './DynamicComponents/Opentext/Opentext';
import Register from './DynamicComponents/Register/Register';
import Facebook from './DynamicComponents/Facebook/Facebook';

import { updateFlowActiveState } from '../../actions/flowState';

const Components = {
  MCQ: MCQ,
  OPENTEXT: Opentext,
  FINISH: Finish,
  REGISTER: Register,
  FACEBOOK: Facebook,
  // REDDIT: Reddit,
  // TWITTER: Twitter,
  // INSTAGRAM: Instagram,
  // YOUTUBE: Youtube,
  // SLACK: Slack,
  // TIKTOK: Tiktok,
  INFO: InfoPage,
};

const UserResponse = () => {
  const dispatch = useDispatch();
  const [currentActive, setCurrentActive] = useState(0);
  const { isLoggedInUser } = useSelector(state => state.userAuth);
  const { translations } = useSelector(state => state.userAuth);
  const { flow, active } = useSelector(state => state.flowState);
  
  const [done, setDone] = useState(false);
    
  const classes = useStyles();

  if (!isLoggedInUser) {
    return <Redirect to="/" />;
  }

  // active is 0 initailly
  if (!flow) {
    console.log('Flow is not configured!');
  }

  const handleNext = () => {
    // dispatch(updateFlowActiveState(active + 1));
    const len = currentActive + 1;
    // we were at the very end
    if (len >= flow.length) setDone(true);
    else setCurrentActive(len);
  };

  const block = (currentActive) => {
    if (typeof Components[flow[currentActive].type] !== "undefined") {
      return React.createElement(Components[flow[currentActive].type], {
        key: flow[currentActive]._id,
        data: flow[currentActive],
      });
    }
    return React.createElement(
      () => <div>The component {flow[currentActive].type} has not been created yet.</div>);
  };

  return (
    <>
    {!done && 
    <>
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Mock Social Media Website
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
    <div className="rootContainer">
      {block(currentActive)}
      <div className="footer">
        <Button className="nextButton" onClick={handleNext}> Next Page </Button>
      </div>
    </div>
    </>}
    {done && <div className="jumbotron text-center">
      <h1 className="display-3">Thank You!</h1>
      <p className="lead"><strong>No further action is required from your side.</strong> You can go ahead and close this tab.</p>
      <hr></hr>
      <p>
        Having trouble? <a target="_blank" rel="noopener noreferrer" href="">Contact us</a>
      </p>
    </div>}
    </>
  );
}

export default UserResponse;

