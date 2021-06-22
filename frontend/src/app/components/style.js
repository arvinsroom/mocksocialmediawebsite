import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    // padding: '20px'
  },
  customColor: {
    backgroundColor: '#2472b2',
    color: '#fff',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#2472b2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2472b2',
      color: '#fff',
    },
    fontFamily: '"Noto Sans", sans-serif',
    fontSize: '16px',
    marginLeft: 'auto',
    marginRight: '0',
    display: 'flex',
  },
  widthFitContent: {
    width: 'fit-content'
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
    fontFamily: '"Noto Sans", sans-serif',
    fontSize: '16px'
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
    backgroundColor: '#2472b2 !important',
    color: '#fff !important',
  },
  body: {
    fontSize: 16,
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
    boxShadow: '0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2)',
    borderRadius: '5px 5px',
    backgroundColor: '#FFFFFF',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  centerCard: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2)',
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
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Noto Sans", sans-serif',
    fontSize: '16px'
  },
  colorChange: {
    color: '#jkjk'
  }
}));

export default useStyles;