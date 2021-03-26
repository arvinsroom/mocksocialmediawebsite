import { Button, FormControlLabel, FormGroup, Switch, FormControl, FormLabel, TextField } from '@material-ui/core';
import React, { useState } from 'react';
// import { useState } from 'react';
// import useStyles from '../../../style';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
// import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
// import { TEMPLATE, REGISTER_PAGE } from '../../../../constants';

import InfoPage from './DynamicComponents/InfoPage/InfoPage';
import Finish from './DynamicComponents/Finish/Finish';
import MCQ from './DynamicComponents/MCQ/MCQ';
import Opentext from './DynamicComponents/Opentext/Opentext';
import Register from './DynamicComponents/Register/Register';
import SocialMedia from './DynamicComponents/SocialMedia/SocialMedia';

import { updateFlowActiveState } from '../../actions/flowState';

const Components = {
  MCQ: MCQ,
  OPENTEXT: Opentext,
  FINISH: Finish,
  REGISTER: Register,
  MEDIA: SocialMedia,
  INFO: InfoPage,
};

const UserResponse = () => {
  const dispatch = useDispatch();
  const [currentActive, setCurrentActive] = useState(0);
  const { isLoggedInUser } = useSelector(state => state.userAuth);
  const { translations } = useSelector(state => state.userAuth);
  const { flow, active } = useSelector(state => state.flowState);

  if (!isLoggedInUser) {
    return <Redirect to="/" />;
  }

  // active is 0 initailly
  if (!flow) {
    console.log('Flow is not configured!');
  }

  const handleNext = () => {
    // dispatch(updateFlowActiveState(active + 1));
    setCurrentActive(currentActive  + 1);
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
    <div>
      {block(currentActive)}
      <Button onClick={handleNext}> Next Page </Button>
      </div>
    </>
  );
}

export default UserResponse;

