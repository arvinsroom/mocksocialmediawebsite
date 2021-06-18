import "./SidebarOption.css";

const SidebarOption = ({ active, text, Icon }) => {
  return (
    <div className={`twitterSidebarOption ${active && 'twitterSidebarOption--active'}`}>
      <Icon />
      <h2>{text}</h2>
    </div>
  );
};

export default SidebarOption;
