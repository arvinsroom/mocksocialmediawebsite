import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import { clearSnackbar } from "../actions/snackbar";
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';

export default function SuccessSnackbar() {
  const dispatch = useDispatch();

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
          <span id="client-snackbar">
            <IconButton size="small" color="inherit">
              <CheckCircleIcon fontSize="small" />
            </IconButton>
            {snackbarMessage}
          </span>
        );
      
      case "E":
        return (
          <span id="client-snackbar">
            <IconButton size="small" color="inherit">
              <ErrorIcon fontSize="small" />
            </IconButton>
            {snackbarMessage}
          </span>
        );

      case "I":
        return (
          <span id="client-snackbar">
            <IconButton size="small" color="inherit">
              <InfoIcon fontSize="small" />
            </IconButton>
            {snackbarMessage}
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
      autoHideDuration={4000}
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
