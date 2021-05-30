import { Container } from '@material-ui/core';
import React, { useEffect } from 'react';
import useStyles from '../../style';
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from 'react-router-dom';
import "./UserResponse.css";
import { USER_TRANSLATIONS_DEFAULT } from '../../../constants';

import InfoPage from './DynamicComponents/InfoPage/InfoPage';
import Finish from './DynamicComponents/Finish/Finish';
import MCQ from './DynamicComponents/MCQ/MCQ';
import Opentext from './DynamicComponents/Opentext/Opentext';
import Register from './DynamicComponents/Register/Register';
import Facebook from './DynamicComponents/Facebook/Facebook';

import { userLogout } from "../../../actions/userAuth";
import { updateUserMain } from '../../../actions/user';

const Components = {
  MCQ: MCQ,
  OPENTEXT: Opentext,
  FINISH: Finish,
  REGISTER: Register,
  FACEBOOK: Facebook,
  INFO: InfoPage,
};

const UserResponse = () => {
  const dispatch = useDispatch();
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);
  const { flow, active, finished } = useSelector(state => state.flowState);
  let history = useHistory();

  const updateFinishTimeAndLogout = async () => {
    const utcDateTime = new Date();
    var utcDateTimeString = utcDateTime.toISOString().replace('Z', '').replace('T', ' ');
    await dispatch(updateUserMain({ finishedAt: utcDateTimeString }));
    await dispatch(userLogout());
  };

  const classes = useStyles();
  useEffect(() => {
    if (!isLoggedInUser && !finished) history.push('/');
    if (finished) updateFinishTimeAndLogout();
  }, [finished]);

  const block = (currentActive) => {
    if (finished) {
      return React.createElement(
        () =>
        <Container component="main" maxWidth="md" className={classes.centerCard}>
          <div>
            <h1>{(translations && translations['thank_you!']) || 'Thank You!'}</h1>
            <p className="lead">
            <strong>
              {translations?.['your_response_has_been_recorded,_and_you_can_safely_close_this_page.'] || USER_TRANSLATIONS_DEFAULT.RESPONSE_SUCCESSFULLY_RECORDED_CLOSE_TAB}
            </strong>
            </p>
          </div>
        </Container>
      );  
    }
    else if (currentActive !== -1 && typeof Components[flow[currentActive]?.type] !== "undefined") {
      return React.createElement(Components[flow[currentActive].type], {
        key: flow[currentActive]._id,
        data: flow[currentActive],
      });
    }
    else {
      return React.createElement(
        () => <div>This Flow component configurations have not been created yet.</div>);
    }
  };

  return (
    <div className={classes.paper}>
      {block(active)}
    </div>
  );
}

export default UserResponse;

