import MediaPosts from './MediaPost/MediaPosts';
import Language from './Language/Language';
import Upload from './Upload/Upload';

import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Container } from '@material-ui/core';
import { useEffect } from 'react';
import useStyles from '../../../../style';

const General = () => {
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const { _id: templateId } = useSelector(state => state.template);
  const classes = useStyles();

  useEffect(() => {
    
  }, []);

  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }

  return (
    <>
    <Container component="main" maxWidth="lg" className={classes.card}>
      <p>Step 1</p>
      <MediaPosts templateId={templateId} />
    </Container>
    <br></br>
    <Container component="main" maxWidth="lg" className={classes.card}>
      <p>Step 2</p>
      <Upload templateId={templateId}/>
    </Container>
    <br></br>
    <Container component="main" maxWidth="lg" className={classes.card}>
      <p>Step 3</p>
      <Language templateId={templateId}/>
    </Container>
    </>
  );
}

export default General;