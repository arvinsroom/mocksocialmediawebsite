import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useStyles from '../../../style';
import Feed from './Feed/Feed';
import { Redirect } from 'react-router-dom';
import "./Facebook.css";
import { getFacebookPosts } from "../../../../actions/facebook";
import { updateFlowDisabledState } from '../../../../actions/flowState';

const Facebook = ({ data }) => {
  const { isLoggedInUser } = useSelector(state => state.userAuth);
  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    // fetch facebook posts depending on the page ID
    dispatch(getFacebookPosts(data._id, data.pageDataOrder))
  };

  useEffect(() => {
    fetch();
    dispatch(updateFlowDisabledState());
  }, []);

  return (
    <div className="facebookMainBody">
      <Feed />
        {/* {defaultPosts && defaultPosts.length > 0 ? 
          <>
          </>
        : null} */}
    </div>
  )
};

export default Facebook;
