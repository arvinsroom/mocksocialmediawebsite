import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import useStyles from '../../../style';
import Feed from './Feed/Feed';
import { Redirect } from 'react-router-dom';
import "./Facebook.css";
import {
  getFacebookPostsCount,
  getFacebookPosts,
  clearFacebookState
} from "../../../../actions/facebook";
import { updateFlowActiveState } from '../../../../actions/flowState';
import Progress from '../../../Progress';
import { Button, Container } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const Facebook = ({ data }) => {
  const { isLoggedInUser, languageName } = useSelector(state => state.userAuth);
  const isLoading = useSelector(state => state.facebookPost.isLoading);

  const totalPostCount = useSelector(state => state.facebookPost.totalPostCount);
  const allIds = useSelector(state => state.facebookPost.allIds);
  
  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    dispatch(clearFacebookState());
    // fetch all facebook Ids and their counts
    const getRequest = {
      templateId: data.templateId,
      pageId: data._id,
      platform: data.type,
      order: data.pageDataOrder,
      language: languageName,
    }
    dispatch(getFacebookPostsCount(getRequest));
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    fetch();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(updateFlowActiveState());
  };

  return (
    <>
      <Container component="main" maxWidth="sm">
        <div className="facebookMainBody">
          {totalPostCount > 0 && <Feed />}
          {totalPostCount === 0 && <h4>No Posts Exists!</h4>}
        </div>
        {isLoading && <Progress />}
        <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={allIds.length < totalPostCount}
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

export default Facebook;
