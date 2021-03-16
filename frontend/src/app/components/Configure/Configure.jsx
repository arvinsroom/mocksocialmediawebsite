import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Template from './AdminConfigurePortal/Template/Template';
import General from './AdminConfigurePortal/General/General';
import Register from './AdminConfigurePortal/Register/Register';
import InfoPage from './AdminConfigurePortal/InfoPage/InfoPage';
import MCQ from './AdminConfigurePortal/MCQ/MCQ';
import OpenText from './AdminConfigurePortal/OpenText/OpenText';
import LastPage from './AdminConfigurePortal/LastPage/LastPage';
import Flow from './AdminConfigurePortal/Flow/Flow';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { logout } from "../../actions/auth";
import { useHistory } from "react-router-dom";
import { clearMessage } from "../../actions/message";
import { Redirect } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const Configure = () => {
  let history = useHistory();
  const [value, setValue] = React.useState(0);
  const [templateId, setTemplateId] = useState(null); // default null
  const { isLoggedIn } = useSelector(state => state.auth);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch, history]);

  if (!isLoggedIn) {
    return <Redirect to="/admin" />;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button onClick={() => dispatch(logout())} color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>

      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs for template settings"
        >
          <Tab label="Template" {...a11yProps(0)} />
          <Tab label="General" {...a11yProps(1)} disabled={templateId === null ? true : false}/>
          <Tab label="Register" {...a11yProps(2)} disabled={templateId === null ? true : false}/>
          <Tab label="InfoPage" {...a11yProps(3)} disabled={templateId === null ? true : false}/>
          <Tab label="MCQ" {...a11yProps(4)} disabled={templateId === null ? true : false}/>
          <Tab label="OpenText" {...a11yProps(5)} disabled={templateId === null ? true : false}/>
          <Tab label="LastPage" {...a11yProps(6)} disabled={templateId === null ? true : false}/>
          <Tab label="Flow" {...a11yProps(7)} disabled={templateId === null ? true : false}/>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Template setTemplateId={setTemplateId}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <General templateId={templateId}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Register templateId={templateId}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <InfoPage templateId={templateId}/>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <OpenText templateId={templateId}/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <MCQ templateId={templateId}/>
      </TabPanel>
      <TabPanel value={value} index={6}>
        <LastPage templateId={templateId}/>
      </TabPanel>
      <TabPanel value={value} index={7}>
        <Flow templateId={templateId}/>
      </TabPanel>
    </>
  );
}

export default Configure;
