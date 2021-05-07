import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    // padding: '20px'
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
    marginBottom: '5%'
  },
  title: {
    flexGrow: 1,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  root: {
    flexGrow: 1,
  },
  rootText: {
    marginBottom: '20px'
  },
  floatRight: {
    float: 'right !important',
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
    marginLeft: '20px',
    marginRight: '20px'
  },
  table: {
    minWidth: 650,
  },
  head: {
    backgroundColor: 'cornsilk',
    color: 'black',
  },
  body: {
    fontSize: 14,
  },
  marginTopBottom: {
    float: 'right !important',
    marginTop: '10px',
    marginBottom: '10px'
  },
  note: {
    padding: '12px',
    borderLeft: 'solid 4px #3498db',
    backgroundColor: '#f0f7fb',
    lineHeight: '18px',
    overflow: 'auto',
    margin: '10px',
  },
  errorSnackbar: {
    backgroundColor: '#f44336',
    color: '#fff'
  },
  infoSnackbar: {
    backgroundColor: '#2196f3',
    color: '#fff'
  },
  successSnackbar: {
    backgroundColor: '#4caf50',
    color: '#fff'
  },
  paddingTopBottom: {
    paddingTop: '15px',
    paddingBottom: '10px'
  },
  feed: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  marginTop: {
    marginTop: theme.spacing(4),
  },
  post: {
    width: '100%',
    justifyContent: 'center',
    marginTop: '15px',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
  },
  card: {
    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    borderRadius: '5px 5px',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  centerCard: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    borderRadius: '5px 5px',
  },
  adminSaveButton: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    float: 'right',
    margin: theme.spacing(3, 0, 2),
  }
}));

export default useStyles;