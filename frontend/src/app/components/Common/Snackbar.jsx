import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import { clearSnackbar } from "../../actions/snackbar";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { IconCircleCheck, IconInfoCircle, IconAlertCircle } from '@tabler/icons-react';
import useStyles from '../style';

export default function CustomSnackbar() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { type, snackbarMessage, open } = useSelector(
    state => state.snackbar
  );

  function handleClose() {
    dispatch(clearSnackbar());
  }

  const properSnackbar = () => {
    switch (type) {
      case "S":
        return (
          <span id="client-snackbar" className={classes.flexCenter}>
            <IconCircleCheck /> &nbsp; {snackbarMessage}
          </span>
        );
      
      case "E":
        return (
          <span id="client-snackbar" className={classes.flexCenter}>
            <IconAlertCircle /> &nbsp; {snackbarMessage}
          </span>
        );

      case "I":
        return (
          <span id="client-snackbar" className={classes.flexCenter}>
            <IconInfoCircle /> &nbsp; {snackbarMessage}
          </span>
        );
  
      default: 
          return (
            null
          );
        }
    }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      aria-describedby="client-snackbar"
      message={properSnackbar()}
      action={[
        <IconButton key={new Date()} size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      ]}
    />
  );
}
