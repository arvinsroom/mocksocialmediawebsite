import DynamicMedia from './DynamicMedia';
import { useSelector } from "react-redux";
import "./Link.css";

const Link = ({ index }) => {
  const { posts } = useSelector(state => state.facebookPost);

  return (
    <a href={posts[index].link} className="link-preview" target="_blank" rel="noopener noreferrer">
    <div className="link-area">
      <div className="og-image">
        <Photo index={index} />
      </div>
      <div className="descriptions">
        <div className="og-title">
          {posts[index].linkTitle}
        </div>
        <div className="og-description">
          {posts[index].linkPreview}
        </div>
      </div>
    </div>
  </a>
  );
}

export default Link;