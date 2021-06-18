import "./Text.css";

const Text = ({ postMessage, link, customClassName }) => {
  return (
    <>
      <div className={customClassName ? customClassName : "postBottom"}>
        <p>{postMessage ? postMessage : ""}</p>
        {/* <p>{link ? link : ""}</p> */}
      </div>
    </>
  );
}

export default Text;
