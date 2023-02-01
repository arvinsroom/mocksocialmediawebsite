import "./SidebarOption.css";

const SidebarOption = ({ active, text, Icon }) => {
  return (
    <div className="twSideItem">
      <div className={`twitterSidebarOption`}>
        <Icon className="twSidebarIcon"/>
        <div className={`twSidebarText ${active ? 'twSidebarText--active' : ''}`}>{text}</div>
      </div>
    </div>
  );
};

export default SidebarOption;
