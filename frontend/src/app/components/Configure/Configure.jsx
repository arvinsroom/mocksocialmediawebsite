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
import InfoPage from './AdminConfigurePortal/Info/Info';
import MCQ from './AdminConfigurePortal/MCQ/MCQ';
import OpenText from './AdminConfigurePortal/OpenText/OpenText';
import Finish from './AdminConfigurePortal/Finish/Finish';
import Flow from './AdminConfigurePortal/Flow/Flow';
import { useDispatch, useSelector } from "react-redux";
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { logout } from "../../actions/auth";
import { setTemplateId } from "../../actions/template";
import { Redirect } from 'react-router-dom';
import useStyles from '../style';

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
  const [value, setValue] = React.useState(0);
  const { isLoggedIn } = useSelector(state => state.auth);
  const { _id: templateId } = useSelector(state => state.template);
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  if (!isLoggedIn) {
    return <Redirect to="/admin" />;
  }

  const handleLogout = () => {
    // TODO: for now you cannot work with same template one you refresh or logout
    dispatch(setTemplateId(null)); // clear template Id, when changing location
    dispatch(logout()); // remove user object
  }

  return (
    <>
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Current Template ID: {templateId}
          </Typography>
          <Button onClick={handleLogout} color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </div>

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
          <Tab label="General" {...a11yProps(1)} disabled={!templateId ? true : false}/>
          <Tab label="Register" {...a11yProps(2)} disabled={!templateId ? true : false}/>
          <Tab label="InfoPage" {...a11yProps(3)} disabled={!templateId ? true : false}/>
          <Tab label="MCQ" {...a11yProps(4)} disabled={!templateId ? true : false}/>
          <Tab label="OpenText" {...a11yProps(5)} disabled={!templateId ? true : false}/>
          <Tab label="Finish" {...a11yProps(6)} disabled={!templateId ? true : false}/>
          <Tab label="Flow" {...a11yProps(7)} disabled={!templateId ? true : false}/>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Template />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <General />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Register />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <InfoPage />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <OpenText />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <MCQ />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <Finish />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <Flow />
      </TabPanel>
    </>
  );
}

export default Configure;
