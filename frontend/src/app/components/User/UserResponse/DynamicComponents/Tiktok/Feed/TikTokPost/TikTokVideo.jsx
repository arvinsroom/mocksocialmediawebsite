import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
import {
  BookmarkBorder,
  ChatBubbleOutline,
  FavoriteOutlined,
  MusicNote,
  Share,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import { selectSocialMediaAuthor } from "../../../../../../../selectors/socialMediaAuthors";
import "./TikTokVideo.css";

// Get the base url for the API
// TODO: Move this to .env file, for any production deployment this should be changed
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:8081/api"
    : "https://studysocial.media/api";
};

const LoadingPlaceholder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 540 960"
    style={{ width: "100%", height: "100%" }}
  >
    <rect width="100%" height="100%" fill="#f8f9fa" />
    <circle cx="270" cy="480" r="80" fill="#e9ecef" />
    <path d="M250,440 L310,480 L250,520 Z" fill="#adb5bd" />
    <text
      x="270"
      y="600"
      fontFamily="Arial, sans-serif"
      fontSize="24"
      textAnchor="middle"
      fill="#6c757d"
    >
      Loading video...
    </text>
  </svg>
);

const ErrorPlaceholder = ({ errorMessage = "Video unavailable" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 540 960"
    style={{ width: "100%", height: "100%" }}
  >
    <rect width="100%" height="100%" fill="#f8f9fa" />
    <circle cx="270" cy="450" r="80" fill="#e9ecef" />
    <path
      d="M230,410 L310,490 M310,410 L230,490"
      stroke="#adb5bd"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <text
      x="270"
      y="580"
      fontFamily="Arial, sans-serif"
      fontSize="24"
      textAnchor="middle"
      fill="#6c757d"
    >
      {errorMessage}
    </text>
    <text
      x="270"
      y="620"
      fontFamily="Arial, sans-serif"
      fontSize="18"
      textAnchor="middle"
      fill="#adb5bd"
    >
      Please try again later
    </text>
  </svg>
);

const TikTokVideo = ({ mediaPath, singlePost }) => {
  const singlePostAuthor = useSelector((state) =>
    selectSocialMediaAuthor(state, singlePost?.authorId)
  );
  const pageId = useSelector((state) => state.socialMedia.pageId);
  const videoSrc = `${getBaseUrl()}/media/stream/${pageId}/${mediaPath}`;
  const videoRef = useRef(null);
  const observerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_RETRY_ATTEMPTS = 1;
  const [progress, setProgress] = useState(0);

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

  const handleVideoClick = () => {
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

  return (
    <div className="video-container">
      {error ? <ErrorPlaceholder errorMessage={error} /> :
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
      </video>}

      <div className="progress-bar">
        <div className="progress-filled" style={{ width: `${progress}%` }} />
      </div>

      <div className="video-overlay">
        {/* Right sidebar */}
        <div className="action-sidebar">
          {/* Author picture */}
          <div className="author-picture">
            {singlePost?.attachedAuthorPicture ? (
              <img src={singlePost.attachedAuthorPicture} alt="author" />
            ) : (
              <div className="author-placeholder" />
            )}
          </div>

          {/* Action buttons */}
          <div className="action-button">
            <FavoriteOutlined />
            <span>0</span>
          </div>
          <div className="action-button">
            <ChatBubbleOutline />
            <span>0</span>
          </div>
          <div className="action-button">
            <BookmarkBorder />
            <span>0</span>
          </div>
          <div className="action-button">
            <Share />
            <span>0</span>
          </div>
          {/* replicate the authorID profile photo here, which is what TikTok does by default now */}
          <div className="author-picture">
            {singlePost?.attachedAuthorPicture ? (
              <img src={singlePost.attachedAuthorPicture} alt="author" />
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
              <span className="verified-badge">✓</span>
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
    </div>
  );
};

export default TikTokVideo;
