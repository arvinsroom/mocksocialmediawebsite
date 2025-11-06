import React, { useCallback, useState } from "react";
import "./AnimatedLikeButton.css";
import { LikeIcon } from "./TikTokActionButton";

const Particle = ({ style }) => <div className="particle" style={style} />;

const generateRandomColor = () => {
  // Array of TikTok-style colors
  const colors = [
    "#fe2c55", // TikTok Red
    "#25F4EE", // TikTok Teal
    "#FE2D5E", // Pink
    "#4DE8F4", // Light Blue
    "#FFDC2C", // Yellow
    "#FF44EC", // Magenta
    "#37BBFE", // Sky Blue
    "#FF2C55", // Red
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const AnimatedLikeButton = ({ isLiked, onLike, likeCount }) => {
  const [particles, setParticles] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const createParticles = useCallback(() => {
    const particleCount = 12; // Reduced for better performance
    const angles = [...Array(particleCount)].map(
      (_, i) => (i * 360) / particleCount
    );

    const newParticles = angles.map((angle, i) => ({
      id: `${Date.now()}-${i}`,
      angle,
      distance: 20 + Math.random() * 10, // Random distance between 20-
      color: generateRandomColor(),
    }));

    setParticles(newParticles);

    // Clean up particles
    setTimeout(() => {
      setParticles([]);
    }, 600);
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAnimating) {
      setIsAnimating(true);

      // Trigger like action
      onLike(e);

      // Create particles
      createParticles();

      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  };

  return (
    <div className="like-button-container">
      {/* Container for heart and particles */}
      <div className="heart-container">
        {/* Heart icon with animations */}
        <div
          className={`heart-wrapper ${isAnimating ? "scale-animation" : ""}`}
        >
          <div
            className={`heart-icon ${isLiked ? "liked animate-like" : ""} 
          ${isAnimating ? "animate-like" : ""}`}
            onClick={handleClick}
          >
            <LikeIcon filled={isLiked} width={24} height={24} />
          </div>
        </div>

        {/* Particles */}
        {particles.map((particle) => {
          const style = {
            "--angle": `${particle.angle}deg`,
            "--distance": `${particle.distance}px`,
            backgroundColor: particle.color,
            animation: "particle 0.6s ease-out forwards",
          };
          return <Particle key={particle.id} style={style} />;
        })}
      </div>

      {/* Like count */}
      <span className={`like-count ${isLiked ? "liked" : ""}`}>
        {likeCount}
      </span>
    </div>
  );
};

export default AnimatedLikeButton;
