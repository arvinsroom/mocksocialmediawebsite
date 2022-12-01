import { Container } from '@material-ui/core';
import React, { useEffect } from 'react';
import useStyles from '../../style';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { getCurrentUTCTime }  from '../../../utils';
import "./UserResponse.css";

import InfoPage from './DynamicComponents/InfoPage/InfoPage';
import Finish from './DynamicComponents/Finish/Finish';
import MCQ from './DynamicComponents/MCQ/MCQ';
import Opentext from './DynamicComponents/Opentext/Opentext';
import Register from './DynamicComponents/Register/Register';
import Facebook from './DynamicComponents/Facebook/Facebook';
import Twitter from './DynamicComponents/Twitter/Twitter';

import { userLogout } from "../../../actions/userAuth";
import { updateUserMain } from '../../../actions/user';
import { USER_TRANSLATIONS_DEFAULT } from '../../../constants';

const Components = {
  MCQ: MCQ,
  OPENTEXT: Opentext,
  FINISH: Finish,
  REGISTER: Register,
  FACEBOOK: Facebook,
  INFO: InfoPage,
  TWITTER: Twitter,
};

const UserResponse = () => {
  const dispatch = useDispatch();
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);
  const { flow, active, finished } = useSelector(state => state.flowState);

  let history = useHistory();

  const updateFinishTimeAndLogout = async () => {
    // update last flow data
    await dispatch(updateUserMain({ finishedAt: getCurrentUTCTime() }));
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
            <p>
              {translations?.['your_response_has_been_recorded,_and_you_can_safely_close_this_page.'] || USER_TRANSLATIONS_DEFAULT.RESPONSE_SUCCESSFULLY_RECORDED_CLOSE_TAB}
            </p>
          </div>
        </Container>
      );  
    }
    else if (currentActive !== -1 && typeof Components[flow[currentActive]?.type] !== "undefined") {
      const pageType = flow[currentActive].type;
      return React.createElement(Components[pageType], {
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
    <Container component="main" maxWidth="md"
      className={flow[active]?.type === 'TWITTER' || flow[active]?.type === 'FACEBOOK' ? `${classes.card} twitterCSS` : `${classes.card}`}
     >
      {block(active)}
    </Container>
  );
}

export default UserResponse;