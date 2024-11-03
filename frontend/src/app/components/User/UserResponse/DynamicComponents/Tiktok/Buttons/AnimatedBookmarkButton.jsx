import React, { useCallback, useState } from "react";
import { BookmarkIcon } from "./TikTokActionButton";
import "./AnimatedBookmarkButton.css";

const Particle = ({ style }) => <div className="particle" style={style} />;

const AnimatedBookmarkButton = ({
  isBookmarked,
  onBookmark,
  bookmarkCount,
}) => {
  const [particles, setParticles] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const createParticles = useCallback(() => {
    const particleCount = 12;
    const angles = [...Array(particleCount)].map(
      (_, i) => (i * 360) / particleCount
    );

    const newParticles = angles.map((angle, i) => ({
      id: `${Date.now()}-${i}`,
      angle,
      distance: 20 + Math.random() * 10,
    }));

    setParticles(newParticles);

    setTimeout(() => {
      setParticles([]);
    }, 600);
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAnimating) {
      setIsAnimating(true);
      onBookmark(e);
      createParticles();

      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  };

  return (
    <div className="bookmark-button-container">
      <div className="bookmark-container">
        <div
          className={`bookmark-wrapper ${isAnimating ? "scale-animation" : ""}`}
        >
          <div
            className={`bookmark-icon-wrapper ${isBookmarked ? "bookmarked animate-bookmark" : ""} 
              ${isAnimating ? "animate-bookmark" : ""}`}
            onClick={handleClick}
          >
            <BookmarkIcon filled={isBookmarked} width={24} height={24} />
          </div>
        </div>

        {particles.map((particle) => {
          const style = {
            "--angle": `${particle.angle}deg`,
            "--distance": `${particle.distance}px`,
            animation: "particle 0.6s ease-out forwards",
          };
          return <Particle key={particle.id} style={style} />;
        })}
      </div>

      <span className={`bookmark-count ${isBookmarked ? "bookmarked" : ""}`}>
        {bookmarkCount}
      </span>
    </div>
  );
};

export default AnimatedBookmarkButton;
