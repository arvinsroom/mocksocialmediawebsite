import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useStyles from '../../../style';
import Feed from './Feed/Feed';
import "./Facebook.css";
import { getFacebookPosts } from "../../../../actions/facebook";

const Facebook = ({ data }) => {
  console.log('SocialMedia: ', data);

  const dispatch = useDispatch();
  const classes = useStyles();
  
  const fetch = async () => {
    // fetch facebook posts depending on the page ID
    dispatch(getFacebookPosts(data._id))
  };

  useEffect(() => {
    fetch();
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
