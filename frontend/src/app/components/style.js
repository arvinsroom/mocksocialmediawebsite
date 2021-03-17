import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
    width: '100%'
  },
  marginBottom:{
    marginBottom: '10%'
  },
  title: {
    flexGrow: 1,
  },
  root: {
    flexGrow: 1,
  },
  rootText: {
    marginBottom: '20px'
  },
  floatRight: {
    float: 'right',
    margin: 'auto'
  },
  textGrid: {
    width: '95%',
    margin: '10px'
  },
  floatLeft: {
    float: 'left',
    margin: 'auto'
  },
  center: {
    width: '100%'
  },
  marginAuto: {
    margin: 'auto'
  },
  marginTenPx: {
    margin: '10px'
  },
  divider: {
    margin: 20
  }
}));

export default useStyles;