import MediaPosts from './MediaPost/MediaPosts';
import Language from './Language/Language';
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Container, Divider } from '@material-ui/core';
import { useEffect, useState } from 'react';
import useStyles from '../../../style';

const General = () => {
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const { _id: templateId } = useSelector(state => state.template);
  const [disable, setDisable] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    
  }, []);

  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }

  return (
    <>
    <Container component="main" maxWidth="lg" className={classes.card}>
      <MediaPosts templateId={templateId} />
    </Container>
    <br></br>
    <Container component="main" maxWidth="lg" className={classes.card}>
      <Language templateId={templateId} disable={disable}/>
    </Container>
    </>
  );
}

export default General;