import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, CssBaseline, TextField, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../actions/userAuth";
import useStyles from '../style';
import { getAllLanguagesData, setActiveLanguage } from '../../actions/global';
import { selectActiveLanguage, selectAllLanguage } from '../../selectors/global';

const UserLogin = () => {
  let history = useHistory();
  const [userLoginState, setUserLoginState] = useState({
    templateId: "",
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (userLoginState.templateId) {
      // send the username and password to the server
      dispatch(userLogin(userLoginState.templateId, userLoginState.qualtricsId))
        .then(() => {
          history.push("/user-response");
        })
        .catch(() => {
          // dispatch should handle error response
        });
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
              label="choose language for this template"
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
            name="templateId"
            label="Template Id"
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            className={classes.submit}
          >
            {selectedLanguage && selectedLanguage['log-in']}
            {console.log('selectedLanguage: ', selectedLanguage)}
          </Button>
          {/* {isLoading && <CircularProgress />} */}
        </form>
      </div>
    </Container>
    </>
  );
};

export default UserLogin;
