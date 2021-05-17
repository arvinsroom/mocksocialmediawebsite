import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useStyles from '../../../style';
import Feed from './Feed/Feed';
import { Redirect } from 'react-router-dom';
import "./Facebook.css";
import {
  getFacebookPostsCount,
  clearFacebookState
} from "../../../../actions/facebook";
import { updateFlowActiveState } from '../../../../actions/flowState';
import { Button, Container } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import StoryCreate from "./Feed/StoryCreate/StoryCreate";

const Facebook = ({ data }) => {
  const { isLoggedInUser, languageName } = useSelector(state => state.userAuth);

  const totalPostCount = useSelector(state => state.facebook.totalPostCount);
  const allIds = useSelector(state => state.facebook.allIds);

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
        <StoryCreate />

        <div className="facebookMainBody">
          {totalPostCount && totalPostCount > 0 ? <Feed /> : <p>No Posts Exists!</p>}
        </div>
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
