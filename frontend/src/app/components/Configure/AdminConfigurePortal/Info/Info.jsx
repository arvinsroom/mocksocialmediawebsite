import {
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Container
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { create } from '../../../../services/info-service';
import { getSocialMediaPages } from '../../../../services/page-service';
import useStyles from '../../../style';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import React, { useRef} from 'react';
import MUIRichTextEditor from 'mui-rte';
import { EditorState, convertToRaw } from 'draft-js'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../actions/snackbar';
import { TEMPLATE, INFO_PAGE } from '../../../../constants';

const InfoPage = () => {
  const [richData, setRichData] = useState();
  const [pageName, setPageName] = useState("");
  const [consent, setConsent] = useState(false);
  const [active, setActive] = useState("");
  const [socialMediaPages, setSocialMediaPages] = useState(null);

  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const { _id: templateId } = useSelector(state => state.template);
  const classes = useStyles();
  const editor = useRef(null);
  const defaultTheme = createMuiTheme();
  const dispatch = useDispatch();

  const fetchSocialMediaPages = async () => {
    const { data } = await getSocialMediaPages(templateId);
    setSocialMediaPages(data.data);
  };

  useEffect(() => {
    fetchSocialMediaPages();
  }, []);

  const resetValues = () => {
    const emplyObj = JSON.stringify(
      convertToRaw(EditorState.createEmpty().getCurrentContent()));
    setRichData(emplyObj);
    setPageName("");
    setConsent(false);
    setActive("");
  };

  const handleConsent = (e) => {
    setConsent(e.target.checked);
  };

  const handleSave = async (data) => {
    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    const info = {
      templateId: templateId,
      name: pageName,
      type: "INFO",
      info: {
        richText: data,
      },
      consent: consent,
      socialMediaPageId: active
    };
    try {
      const { data } = await create(info);
      if (data._id) {
        dispatch(showSuccessSnackbar(INFO_PAGE.SUCCESSFULLY_CREATED_INFORMATION_PAGE));
        resetValues();
      }
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        dispatch(showErrorSnackbar(resMessage));
    }
  };

  const handleExternalSave = () => {
    // evoke ref save
    editor.current?.save();
  };

  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }


  Object.assign(defaultTheme, {
    overrides: {
      MUIRichTextEditor: {
        root: {
          backgroundColor: "#ebebeb",
        },
        container: {
          display: "flex",
          flexDirection: "column-reverse"
        },
        editor: {
          backgroundColor: "#ebebeb",
          padding: "20px",
          height: "200px",
          maxHeight: "200px",
          overflow: "auto"
        },
        toolbar: {
          borderTop: "1px solid gray",
          backgroundColor: "#ebebeb"
        },
        placeHolder: {
          backgroundColor: "#ebebeb",
          paddingLeft: 20,
          width: "inherit",
          position: "absolute",
          top: "20px"
        },
        anchorLink: {
          color: "#333333",
          textDecoration: "underline"
        }
      }
    }
  });

  const handleSocialMediaPage = async (e) => {
    await setActive(e.target.value);
  };

  return (
    <Container component="main" maxWidth="lg" className={classes.card}>
      <TextField
        margin="normal"
        required
        fullWidth
        value={pageName}
        label={INFO_PAGE.PROVIDE_A_UNIQUE_PAGE_NAME}
        onChange={({ target }) => setPageName(target.value)}
        autoFocus
      />
      <MuiThemeProvider theme={defaultTheme}>
        <MUIRichTextEditor
          label="Type something here..."
          onSave={handleSave}
          required
          defaultValue={richData}
          ref={editor}
        />
      </MuiThemeProvider>

      <FormGroup  style={{ padding: '15px' }}>
        <FormControlLabel
          control={<Switch
            checked={consent}
            onChange={handleConsent}
            color="primary"
            name="consent"
            inputProps={{ 'aria-label': 'Render this page as a Consent Page' }}
          />}
          label={INFO_PAGE.ADD_I_CONSENT_AND_I_DO_NOT_CONSENT_TO_THE_BOTTOM}
        />
      </FormGroup>

      <Box component="span" className={classes.note} display="block">
        {INFO_PAGE.ADD_FAKE_POSTS_TO_THE_BOTTOM}
      </Box>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">{INFO_PAGE.SELECT_SOCIAL_MEDIA_PAGE}</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={active}
          onChange={handleSocialMediaPage}
          label={INFO_PAGE.SELECT_SOCIAL_MEDIA_PAGE}
        >
          {socialMediaPages?.length > 0 ? socialMediaPages.map(page => (
            <MenuItem key={page._id} value={page._id}>{page.name}</MenuItem>
          )) : null}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        color="primary"
        onClick={handleExternalSave}
        className={classes.submit}
      >
      Save
      </Button>
    </Container>
  )
}

export default InfoPage;