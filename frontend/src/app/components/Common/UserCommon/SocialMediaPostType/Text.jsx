import "./Text.css";

const Text = ({ postMessage, link, customClassName, charLimit }) => {
  if (charLimit && !isNaN(charLimit)) {
    postMessage = postMessage.slice(0, charLimit);
  }
  
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
