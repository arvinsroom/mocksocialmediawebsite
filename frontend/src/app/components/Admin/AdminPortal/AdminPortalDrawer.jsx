import Template from './AdminPortalConfig/Template/Template';
import General from './AdminPortalConfig/General/General';
import Register from './AdminPortalConfig/Register/Register';
import Info from './AdminPortalConfig/Info/Info';
import MCQ from './AdminPortalConfig/MCQ/MCQ';
import OpenText from './AdminPortalConfig/OpenText/OpenText';
import Finish from './AdminPortalConfig/Finish/Finish';
import Flow from './AdminPortalConfig/Flow/Flow';
import Metrics from './AdminPortalConfig/Metrics/Metrics';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../actions/auth";
import { clearTemplate } from "../../../actions/template";
import { Redirect } from 'react-router-dom';
import { ADMIN_TAB_NAMES, TEMPLATE } from '../../../constants';
import { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, List, CssBaseline, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { IconSettings, IconBrowser, IconUserPlus, IconInfoCircle, IconCheckbox, IconForms, IconExternalLink,
  IconAdjustments, IconDatabase, IconLogout } from '@tabler/icons';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#2472b2, !important',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  customColor: {
    backgroundColor: '#2472b2 !important',
    color: '#fff !important',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const AdminPortalDrawer = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [activeState, setActiveState] = useState('CONDITION-SETTINGS');
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const { _id: templateId, name } = useSelector(state => state.template);
  const dispatch = useDispatch();

  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    // TODO: for now you cannot work with same template one you refresh or logout
    dispatch(clearTemplate()); // clear template Id, when changing location
    dispatch(logout()); // remove user object
  }

  const handleState = (e, state) => {
    e.preventDefault();
    window.history.pushState(null, null, '#' + state.toLowerCase());
    setActiveState(state);
  }

  return (
    <div className={classes.root}>
      {/* <CssBaseline /> */}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
          [classes.customColor]: true
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <p>{TEMPLATE.CURRENT_ACTIVE_CONDITION}: {name}</p>
          </Typography>
          <Button
            onClick={handleLogout}
            color="inherit"
            style={{ marginLeft: 'auto', marginRight: '0' }}
            startIcon={<IconLogout />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key={ADMIN_TAB_NAMES.CONDITION_SETTINGS} onClick={e => handleState(e, 'CONDITION-SETTINGS')}>
            <ListItemIcon><IconSettings/></ListItemIcon>
            <ListItemText primary={ADMIN_TAB_NAMES.CONDITION_SETTINGS} />
          </ListItem>
          <ListItem button key={ADMIN_TAB_NAMES.SOCIAL_MEDIA} onClick={e => handleState(e, 'SOCIAL-MEDIA')} disabled={!templateId ? true : false}>
            <ListItemIcon><IconBrowser/></ListItemIcon>
            <ListItemText primary={ADMIN_TAB_NAMES.SOCIAL_MEDIA} />
          </ListItem>
          <ListItem button key={ADMIN_TAB_NAMES.REGISTRATION} onClick={e => handleState(e, 'REGISTRATION')} disabled={!templateId ? true : false}>
            <ListItemIcon><IconUserPlus/></ListItemIcon>
            <ListItemText primary={ADMIN_TAB_NAMES.REGISTRATION} />
          </ListItem>
          <ListItem button key={ADMIN_TAB_NAMES.INFORMATION} onClick={e => handleState(e, 'INFORMATION')} disabled={!templateId ? true : false}>
            <ListItemIcon><IconInfoCircle/></ListItemIcon>
            <ListItemText primary={ADMIN_TAB_NAMES.INFORMATION} />
          </ListItem>
          <ListItem button key={ADMIN_TAB_NAMES.MULTIPLE_CHOICE} onClick={e => handleState(e, 'MULTIPLE-CHOICE')} disabled={!templateId ? true : false}>
            <ListItemIcon><IconCheckbox/></ListItemIcon>
            <ListItemText primary={ADMIN_TAB_NAMES.MULTIPLE_CHOICE} />
          </ListItem>
          <ListItem button key={ADMIN_TAB_NAMES.OPEN_TEXT} onClick={e => handleState(e, 'OPENTEXT')} disabled={!templateId ? true : false}>
            <ListItemIcon><IconForms/></ListItemIcon>
            <ListItemText primary={ADMIN_TAB_NAMES.OPEN_TEXT} />
          </ListItem>
          <ListItem button key={ADMIN_TAB_NAMES.REDIRECT} onClick={e => handleState(e, 'REDIRECT')} disabled={!templateId ? true : false}>
            <ListItemIcon><IconExternalLink/></ListItemIcon>
            <ListItemText primary={ADMIN_TAB_NAMES.REDIRECT} />
          </ListItem>
          <ListItem button key={ADMIN_TAB_NAMES.STUDY_FLOW} onClick={e => handleState(e, 'STUDY-FLOW')} disabled={!templateId ? true : false}>
            <ListItemIcon><IconAdjustments/></ListItemIcon>
            <ListItemText primary={ADMIN_TAB_NAMES.STUDY_FLOW} />
          </ListItem>
          <ListItem button key={ADMIN_TAB_NAMES.DATA} onClick={e => handleState(e, 'DATA')}>
            <ListItemIcon><IconDatabase/></ListItemIcon>
            <ListItemText primary={ADMIN_TAB_NAMES.DATA} />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
          {activeState === 'CONDITION-SETTINGS' && <Template />}
          {activeState === 'SOCIAL-MEDIA' && <General />}
          {activeState === 'REGISTRATION' && <Register />}
          {activeState === 'INFORMATION' && <Info />}
          {activeState === 'MULTIPLE-CHOICE' && <MCQ />}
          {activeState === 'OPENTEXT' && <OpenText />}
          {activeState === 'REDIRECT' && <Finish />}
          {activeState === 'STUDY-FLOW' && <Flow />}
          {activeState === 'DATA' && <Metrics />}
      </main>
    </div>
  );
}

export default AdminPortalDrawer;