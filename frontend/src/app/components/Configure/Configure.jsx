import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import Template from './AdminConfigurePortal/Template/Template';
import General from './AdminConfigurePortal/General/General';
import Register from './AdminConfigurePortal/Register/Register';
import InfoPage from './AdminConfigurePortal/InfoPage/InfoPage';
import MCQ from './AdminConfigurePortal/MCQ/MCQ';
import OpenText from './AdminConfigurePortal/OpenText/OpenText';
import LastPage from './AdminConfigurePortal/LastPage/LastPage';
import Flow from './AdminConfigurePortal/Flow/Flow';

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
        // <Container>
        //   <Box>
        //       {children}
        //   </Box>
        // </Container>
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const Configure = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
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
          <Tab label="General" {...a11yProps(1)} />
          <Tab label="Register" {...a11yProps(2)} />
          <Tab label="InfoPage" {...a11yProps(3)} />
          <Tab label="MCQ" {...a11yProps(4)} />
          <Tab label="OpenText" {...a11yProps(5)} />
          <Tab label="LastPage" {...a11yProps(6)} />
          <Tab label="Flow" {...a11yProps(7)} />
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
        <LastPage />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <Flow />
      </TabPanel>
    </>
  );
}

export default Configure;
