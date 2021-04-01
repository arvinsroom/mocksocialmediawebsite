import "./StoryReel.css";
import Story from "./Story/Story";

const StoryReel = () => {
  return (
    <div className="storyReel">
      <Story
        image={"https://images.freeimages.com/images/small-previews/2bb/website-advertisement-1243439.jpg"}
        profilePic={"https://images.freeimages.com/images/large-previews/9a0/glassy-web-2-0-style-vector-icons-1153399.jpg"}
        title={"Website"}
      />
      <Story
        image ={"https://images.freeimages.com/images/small-previews/e8f/world-wide-web-analogic-1241408.jpg"}
        profilePic={"https://images.freeimages.com/images/small-previews/9e6/letters-web-2-1574746.jpg"}
        title={"https://"}
      />
      <Story
        image ={"https://images.freeimages.com/images/small-previews/e83/what-u-looking-for-1-1552463.jpg"}
        profilePic={"https://images.freeimages.com/images/small-previews/e50/blue-3-1424956.jpg"}
        title={"Looking?"}
      />
      <Story
        image ={"https://images.freeimages.com/images/small-previews/33a/web-design-1243586.jpg"}
        profilePic={"https://images.freeimages.com/images/small-previews/268/w-w-w-1506459.jpg"}
        title={"Web-design"}
      />
      <Story
        image ={"https://images.freeimages.com/images/large-previews/69f/day-dreaming-1437551.jpg"}
        profilePic={"https://images.freeimages.com/images/small-previews/c02/for-use-on-your-website-please-contact-us-1442088.jpg"}
        title={"Dreaming"}
      />
    </div>
  );
};

export default StoryReel;