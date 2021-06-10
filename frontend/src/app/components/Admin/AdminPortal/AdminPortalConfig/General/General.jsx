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

  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }

  return (
    <>
    <Container component="main" maxWidth="lg" className={classes.card}>
      <h1>Social Media Page</h1>
      <h2>Step 1 - Basic information</h2>
      <MediaPosts templateId={templateId} />
    </Container>
    <br />
    <Container component="main" maxWidth="lg" className={classes.card}>
      <h2>Step 2 - Upload associated media</h2>
      <Upload templateId={templateId}/>
    </Container>
    <br />
    <Container component="main" maxWidth="lg" className={classes.card}>
      <h2>Step 3 - Upload language information</h2>
      <Language templateId={templateId}/>
    </Container>
    </>
  );
}

export default General;