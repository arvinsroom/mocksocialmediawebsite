import { MusicNote } from "@material-ui/icons";
import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bookmarkPost,
  commentFbPost,
  likeFbPost,
  unBookmarkPost,
  unlikeFbPost,
} from "../../../../../../../actions/socialMedia";
import { selectPostsMetadata } from "../../../../../../../selectors/socialMedia";
import { selectSocialMediaAuthor } from "../../../../../../../selectors/socialMediaAuthors";
import AnimatedBookmarkButton from "../../Buttons/AnimatedBookmarkButton";
import AnimatedLikeButton from "../../Buttons/AnimatedLikeButton";
import {
  CommentIcon,
  ErrorPlaceholder,
  LoadingPlaceholder,
  ShareIcon,
  VerifiedIcon,
} from "../../Buttons/TikTokActionButton";
import { Avatar } from "@material-ui/core";
import "./TikTokVideo.css";
import DynamicMediaProfile from "../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMediaProfile";

// Get the base url for the API
// TODO: Move this to .env file, for any production deployment this should be changed
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:8081/api"
    : "https://studysocial.media/api";
};

const TikTokVideo = ({ mediaPath, singlePost }) => {
  const singlePostAuthor = useSelector((state) =>
    selectSocialMediaAuthor(state, singlePost?.authorId)
  );
  const postMetadata = useSelector((state) =>
    selectPostsMetadata(state, singlePost._id)
  );
  const pageId = useSelector((state) => state.socialMedia.pageId);
  const videoSrc = `${getBaseUrl()}/user/media/stream/${pageId}/${mediaPath}`;
  const videoRef = useRef(null);
  const observerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_RETRY_ATTEMPTS = 1;
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const userRegisterData = useSelector((state) => state.userRegister.metaData);
  const [currentComment, setCurrentComment] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    const video = videoRef.current;
    let hlsInstance = null;

    // setup Intersection Observer for autoplay
    const setupObserver = () => {
      const options = {
        root: null,
        rootmargin: "0px",
        threshold: 0.5,
      };

      const handleIntersection = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // video in view, play it
            video?.play().catch((error) => {
              console.error("Failed to play video:", error);
            });
          } else {
            // video not in view, pause it
            video?.pause();
          }
        });
      };

      observerRef.current = new IntersectionObserver(
        handleIntersection,
        options
      );
      if (video) {
        observerRef.current.observe(video);
      }
    };

    const handleFatalError = (message) => {
      console.error("Fatal error:", message);
      setError(message);
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };

    const initializeVideo = () => {
      if (Hls.isSupported()) {
        hlsInstance = new Hls({
          debug: false,
          maxBufferSize: 0.5 * 1000 * 1000,
          maxBufferLength: 5,
          enableWorker: true,
          xhrSetup: (xhr) => {
            // TODO: Make a proxy server to handle this
            xhr.setRequestHeader(
              "x-access-token",
              JSON.parse(localStorage.getItem("user")).accessToken
            );
            xhr.addEventListener("error", () => {
              // Check response status to handle specific errors
              if (xhr.status === 422) {
                handleFatalError("This video is currently unavailable");
              } else if (xhr.status === 404) {
                handleFatalError("Video not found");
              }
            });
          },
        });

        hlsInstance.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (loadAttempts >= MAX_RETRY_ATTEMPTS) {
              handleFatalError("Failed to load video");
              return;
            }

            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (data.response && data.response.code === 422) {
                  handleFatalError("This video is currently unavailable");
                } else {
                  setLoadAttempts((prev) => prev + 1);
                  hlsInstance.startLoad();
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setLoadAttempts((prev) => prev + 1);
                hlsInstance.recoverMediaError();
                break;
              default:
                handleFatalError("An error occurred while loading the video");
                break;
            }
          }
        });

        hlsInstance.loadSource(videoSrc);
        hlsInstance.attachMedia(video);

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          // HLS manifest parsed, setting up observer...
          setupObserver();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        video.addEventListener("loadedmetadata", () => {
          setupObserver(); // Set up observer after metadata is loaded
        });
        video.onerror = () => {
          handleFatalError("Video playback is not supported");
        };
      } else {
        handleFatalError("Video format is not supported in this browser");
      }
    };

    if (!error) {
      initializeVideo();
    }

    // Cleanup
    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (video) {
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [mediaPath, videoSrc, error, loadAttempts]);

  /**
   * Handles the video click event, we also hide commments when video is clicked
   */
  const handleVideoClick = () => {
    // Hide comments when video is clicked if open and return
    if (showComments) {
      setShowComments(false);
      return;
    }

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  /**
   * Handles the like button click event
   */
  const handleToggleLike = (e) => {
    e.preventDefault();
    if (postMetadata.actionId) {
      dispatch(unlikeFbPost(postMetadata.actionId, singlePost._id));
    } else {
      const data = {
        action: "LIKE",
        comment: null,
        userPostId: singlePost._id,
      };
      dispatch(likeFbPost(data, singlePost._id));
    }
  };

  /**
   * Handles the bookmark button click event
   */
  const handleBookmark = (e) => {
    e.preventDefault();
    // already bookmarked, unbookmark it
    if (postMetadata.bookmarkId) {
      dispatch(unBookmarkPost(postMetadata.bookmarkId, singlePost._id));
    } else {
      const data = {
        action: "BOOKMARK",
        comment: null,
        userPostId: singlePost._id,
      };
      dispatch(bookmarkPost(data, singlePost._id));
    }
  };

  /**
   * Handles the comment button click event
   */
  const handleComment = (e) => {
    e.preventDefault();
    if (currentComment) {
      const data = {
        action: "COMMENT",
        comment: currentComment,
        userPostId: singlePost._id,
      };
      dispatch(commentFbPost(data, singlePost._id));
      setCurrentComment("");
    }
  };

  return (
    <div className={`video-container ${showComments ? "with-comments" : ""}`}>
      {error ? (
        <ErrorPlaceholder errorMessage={error} />
      ) : (
        <video
          ref={videoRef}
          controls={false}
          className="video-player"
          playsInline
          onClick={handleVideoClick}
          onTimeUpdate={handleTimeUpdate}
          loop
        >
          <source src={videoSrc} type="application/x-mpegURL" />
          <LoadingPlaceholder />
        </video>
      )}

      <div className="progress-bar">
        <div className="progress-filled" style={{ width: `${progress}%` }} />
      </div>

      <div className="video-overlay">
        {/* Right sidebar */}
        <div className="action-sidebar">
          {/* Author picture */}
          <div className="author-picture">
            {singlePost.attachedAuthorPicture ? (
                <DynamicMediaProfile
                  attachedMedia={singlePost.attachedAuthorPicture}
                />
              ) : (
              <div className="author-placeholder" />
            )}
          </div>

          {/* Action buttons */}
          <AnimatedLikeButton
            isLiked={!!postMetadata.actionId}
            onLike={(e) => handleToggleLike(e)}
            likeCount={
              postMetadata.actionId
                ? postMetadata.initLike + 1
                : postMetadata.initLike
            }
          />
          {/* On click here should open up a comment popup very small one and showld*/}
          <div
            className="action-button"
            onClick={() => setShowComments(!showComments)}
          >
            <CommentIcon />
            <span>{postMetadata.initReply + postMetadata.comments.length}</span>
          </div>

          <AnimatedBookmarkButton
            isBookmarked={!!postMetadata.bookmarkId}
            onBookmark={(e) => handleBookmark(e)}
            bookmarkCount={
              postMetadata.bookmarkId
                ? postMetadata.initBookmark + 1
                : postMetadata.initBookmark
            }
          />

          <div className="action-button">
            <ShareIcon />
            <span>{postMetadata.initShare}</span>
          </div>
          {/* replicate the authorID profile photo here, which is what TikTok does by default now */}
          <div className="author-picture">
            {singlePost.attachedAuthorPicture ? (
                <DynamicMediaProfile
                  attachedMedia={singlePost.attachedAuthorPicture}
                />
              ) : (
              <div className="author-placeholder" />
            )}
          </div>
        </div>

        {/* Bottom info section */}
        <div className="video-info">
          {/* Author info - with null checks */}
          <div className="author-info">
            <span className="author-name">
              {singlePostAuthor?.authorName || "Unknown Author"}
            </span>
            {singlePostAuthor?.authorVerified && (
              <VerifiedIcon />
            )}
            <span className="post-date">{singlePost?.datePosted}</span>
          </div>

          {/* Post text */}
          <div className="post-text">{singlePost?.postMessage}</div>

          {/* Sound info */}
          <div className="sound-info">
            <MusicNote />
            <span className="sound-name">{singlePost?.soundName}</span>
          </div>
        </div>
      </div>

      {/* Comment section */}
      {/* Here all comments will be userComments, so no need to complicate logic. Will need to update when we enable replyTo */}
      <div className={`comment-section ${showComments ? "open" : ""}`}>
        {/* Comments list overlay */}
        {showComments && postMetadata.comments?.length > 0 && (
          <div className="comments-overlay">
            {postMetadata.comments.map(({ comment, userComment }, index) => (
              <div key={index} className="comment-item">
                <div className="comment-author-picture">
                  {userRegisterData["PROFILEPHOTO"] ? (
                    <Avatar src={userRegisterData["PROFILEPHOTO"]} alt="author" />
                  ) : (
                    <div className="author-placeholder" />
                  )}
                </div>
                <div className="comment-content">
                  <span className="comment-author-name">
                    {userRegisterData["USERNAME"] || "You"}
                  </span>
                  <p className="comment-text">{comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="comment-author-picture">
          {userRegisterData["PROFILEPHOTO"] ? (
            <Avatar src={userRegisterData["PROFILEPHOTO"]} alt="author" />
          ) : (
            <div className="author-placeholder" />
          )}
        </div>
        <input
          type="text"
          className="comment-input"
          placeholder="Add a comment..."
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleComment(e) : null)}
        />
        <button className="post-comment-btn" onClick={(e) => handleComment(e)}>
          Post
        </button>
      </div>
    </div>
  );
};

export default TikTokVideo;
