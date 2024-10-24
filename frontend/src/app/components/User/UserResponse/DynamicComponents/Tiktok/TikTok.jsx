import { Button } from "@material-ui/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { updateFlowActiveState } from "../../../../../actions/flowState";
import {
  clearFacebookState,
  getFacebookPostsCount,
} from "../../../../../actions/socialMedia";
import { WINDOW_GLOBAL } from "../../../../../constants";
import useStyles from "../../../../style";
import Feed from "./Feed/Feed";

import "./TikTok.css";

const TikTok = ({ data }) => {
  const { isLoggedInUser, translations, languageName } = useSelector(
    (state) => state.userAuth
  );
  const totalPostCount = useSelector(
    (state) => state.socialMedia.totalPostCount
  );
  // const socialMediaTranslations = useSelector(
  //   (state) => state.socialMedia.socialMediaTranslations
  // );

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    // clear old social media state
    dispatch(clearFacebookState());
    // fetch all social media Ids and their counts
    const getRequest = {
      templateId: data.templateId,
      pageId: data._id,
      platform: data.type,
      order: data.pageDataOrder,
      language: languageName,
    };
    dispatch(getFacebookPostsCount(getRequest));
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Navigate to="/" />;
    fetch();
    window.onbeforeunload = function () {
      return WINDOW_GLOBAL.RELOAD_ALERT_MESSAGE;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateFlowActiveState());
  };

  return (
    <>
      <div className="tiktok">
        <div className="tiktokFeed">
          {/* TikTok feed */}
          {totalPostCount && totalPostCount > 0 ? (
            <Feed />
          ) : (
            <p>No Posts Exist!</p>
          )}

          <div className="tiktokNextScreen">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={classes.submit}
              endIcon={<IconChevronRight />}
            >
              {translations?.next || "NEXT"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TikTok;
