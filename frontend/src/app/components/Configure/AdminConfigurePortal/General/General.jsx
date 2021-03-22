import MediaPosts from './MediaPosts';
import Language from './Language';
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

const General = () => {
  const { isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    return <Redirect to="/admin" />;
  }

  return (
    <>
      <MediaPosts />
      <Language />
    </>
  );
}

export default General;