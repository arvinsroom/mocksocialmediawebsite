import MediaPosts from './MediaPosts';
import Language from './Language';
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

const General = () => {
  const { isLoggedInAdmin } = useSelector(state => state.auth);

  if (!isLoggedInAdmin) {
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