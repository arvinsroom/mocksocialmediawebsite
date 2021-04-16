import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, CssBaseline, TextField, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../actions/userAuth";
import useStyles from '../style';
import { getAllLanguagesData, setActiveLanguage } from '../../actions/global';
import { selectActiveLanguage, selectAllLanguage } from '../../selectors/global';
import { showInfoSnackbar } from "../../actions/snackbar";

const UserLogin = () => {
  let history = useHistory();
  const [userLoginState, setUserLoginState] = useState({
    templateCode: "",
    qualtricsId: "",
  });
  // const [defaultMockLanguages, setDefaultMockLanguages] = useState(null);
  const [activeId, setActiveId] = useState("");
  const classes = useStyles();
  const { isLoggedInUser } = useSelector(state => state.userAuth);
  const dispatch = useDispatch();
  // const selectedLanguage = useSelector(state => state.global.languages[]);
  const selectedLanguage = useSelector(state => selectActiveLanguage(state));
  const selectMenuOptions = useSelector(state => selectAllLanguage(state));

  const fetchDefaultLan = async () => {
    dispatch(getAllLanguagesData());
  }

  useEffect(() => {
    fetchDefaultLan();
    // if (isLoggedInUser) history.push("/user-response");
  }, []);

  const checkValidity = (id) => {
    if (id && id.length === 6 && Number(id)) return true;
    else return false;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (checkValidity(userLoginState.templateCode) && checkValidity(userLoginState.qualtricsId)) { 
      // send the username and password to the server
      const tempCode = Number(userLoginState.templateCode);
      const qualCode = Number(userLoginState.qualtricsId);
      dispatch(userLogin(tempCode, qualCode))
        .then(() => {
          history.push("/user-response");
        })
        .catch(() => {
          // dispatch should handle error response
        });
    } else {
      dispatch(showInfoSnackbar("Please provide a valid Template Code/ Qualtrics Id"));
    }
  };

  const handleActiveLanguages = async (e) => {
    await setActiveId(e.target.value);
    dispatch(setActiveLanguage(e.target.value));
  };

  return (
    <>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component={'span'} variant="h5">
          Select language
        </Typography>
        <Typography component={'span'} variant="h5">
          ਭਾਸ਼ਾ ਚੁਣੋ
        </Typography>
        <Typography component={'span'} variant="h5">
          选择语言
        </Typography>
        <Typography component={'span'} variant="h5">
          Choisir la langue
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={activeId}
              onChange={handleActiveLanguages}
            >
              {selectMenuOptions?.length > 0 ? selectMenuOptions.map(row => (
                <MenuItem key={row._id} value={row._id}>{row.name}</MenuItem>
              )) : null}
            </Select>
          </FormControl>
          {/* {isLoading && <CircularProgress />} */}
        </form>
      </div>
    </Container>

    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component={'span'} variant="h5">
          Sign in for providing Response
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="templateCode"
            label="Template Code"
            onChange={({ target }) => setUserLoginState({ ...userLoginState, [target.name]: target.value })}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="qualtricsId"
            label="Qualtrics Id"
            onChange={({ target }) => setUserLoginState({ ...userLoginState, [target.name]: target.value })}
          />
          {selectedLanguage && <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            className={classes.submit}
          >
            {selectedLanguage['log-in']}
          </Button>}
          {/* {isLoading && <CircularProgress />} */}
        </form>
      </div>
    </Container>
    </>
  );
};

export default UserLogin;
