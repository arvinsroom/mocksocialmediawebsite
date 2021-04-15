import { Avatar } from "@material-ui/core";
import "./Story.css";

const Story = ({ image, profilePic, title }) => {
    return (
      <div style={{ backgroundImage: `url(${image})` }} className="story">
        <Avatar className="storyAvatar" src={profilePic}/>
        <h4>{title}</h4>
      </div>
    );
  }

export default Story;