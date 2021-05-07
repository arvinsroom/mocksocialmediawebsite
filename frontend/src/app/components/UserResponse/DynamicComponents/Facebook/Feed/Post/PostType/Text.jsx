import "./Text.css";

const Text = ({ postMessage, link }) => {
  return (
    <>
      <div className="postBottom">
        <p>{postMessage ? postMessage : ""}</p>
        {/* <p>{link ? link : ""}</p> */}
      </div>
    </>
  );
}

export default Text;
