import "./StoryReel.css";
import Story from "./Story/Story";

const StoryReel = () => {
  return (
    <div className="storyReel">
      <Story
        image={"https://blog.ispionage.com/wp-content/uploads/2013/11/Link-Building-Tool-Pic.jpg"}
        profilePic={"https://images.freeimages.com/images/large-previews/9a0/glassy-web-2-0-style-vector-icons-1153399.jpg"}
        title={"Website"}
      />
      <Story
        image ={"https://www.bigcommerce.com/blog/wp-content/uploads/2017/08/inbound-link-backs-hero.jpg"}
        profilePic={"https://images.freeimages.com/images/small-previews/9e6/letters-web-2-1574746.jpg"}
        title={"https://"}
      />
      <Story
        image ={"https://images.iconfu.com/sets/8-omni/icons/earth_link_icon.png"}
        profilePic={"https://images.freeimages.com/images/small-previews/e50/blue-3-1424956.jpg"}
        title={"Looking?"}
      />
      <Story
        image ={"https://cdn.hundred.org/uploads/innovation/cover_image/2369/wide_logo-mockup03212020.jpg"}
        profilePic={"https://images.freeimages.com/images/small-previews/268/w-w-w-1506459.jpg"}
        title={"Web-design"}
      />
      <Story
        image ={"https://linksearching.com/wp-content/uploads/2015/12/best-free-online-broken-link-checker-tool.jpg"}
        profilePic={"https://images.freeimages.com/images/small-previews/c02/for-use-on-your-website-please-contact-us-1442088.jpg"}
        title={"Dreaming"}
      />
    </div>
  );
};

export default StoryReel;