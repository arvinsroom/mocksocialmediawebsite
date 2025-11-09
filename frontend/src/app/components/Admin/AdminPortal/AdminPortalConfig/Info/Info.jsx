import {
  Box,
  Button,
  Container,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@material-ui/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import clsx from "clsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  showErrorSnackbar,
  showInfoSnackbar,
  showSuccessSnackbar,
} from "../../../../../actions/snackbar";
import { INFO_PAGE, TEMPLATE } from "../../../../../constants";
import { create } from "../../../../../services/info-service";
import { checkIfEmptyRichText } from "../../../../../utils";
import RichTextArea from "../../../../Common/AdminCommon/RichTextArea";
import SocialMediaPages from "../../../../Common/AdminCommon/SocialMediaPages";
import useStyles from "../../../../style";

const InfoPage = () => {
  const [clearRichText, setClearRichText] = useState(false);
  const [richText, setRichText] = useState(null);
  const [pageName, setPageName] = useState("");
  const [consent, setConsent] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [responseCode, setResponseCode] = useState(false);
  const [pageActive, setPageActive] = useState({
    pageId: "",
    pageType: "",
  });

  const { isLoggedInAdmin } = useSelector((state) => state.auth);
  const { _id: templateId } = useSelector((state) => state.template);
  const classes = useStyles();
  const dispatch = useDispatch();

  const resetValues = async () => {
    await setClearRichText(true);
    await setPageName("");
    await setConsent(false);
    await setPageActive({
      pageId: "",
      pageType: "",
    });
    await setConsent(false);
    await setIsFinish(false);
    await setResponseCode(false);
  };

  const handleConsent = (e) => {
    setConsent(e.target.checked);
  };

  const handleIsFinish = (e) => {
    setIsFinish(e.target.checked);
  };

  const handleResponseCode = (e) => {
    setResponseCode(e.target.checked);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }

    const info = {
      templateId: templateId,
      name: pageName,
      type: "INFO",
      richText: checkIfEmptyRichText(richText) ? null : richText,
      consent: consent,
      socialMediaPageId: pageActive.pageId,
      isFinish: isFinish,
      responseCode: responseCode,
    };
    try {
      await create(info);
      await dispatch(
        showSuccessSnackbar(INFO_PAGE.SUCCESSFULLY_CREATED_INFORMATION_PAGE)
      );
      await resetValues();
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

  if (!isLoggedInAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <Container component="main" maxWidth="lg" className={classes.card}>
      <h1>Information Page</h1>
      <TextField
        margin="normal"
        required
        fullWidth
        value={pageName}
        label={INFO_PAGE.PROVIDE_A_UNIQUE_PAGE_NAME}
        onChange={({ target }) => setPageName(target.value)}
        autoFocus
      />

      <RichTextArea setRichText={setRichText} clearRichText={clearRichText} />

      <FormGroup style={{ padding: "15px" }}>
        <FormControlLabel
          control={
            <Switch
              checked={consent}
              onChange={handleConsent}
              color="primary"
              name="consent"
              inputProps={{
                "aria-label": "Render this page as a Consent Page",
              }}
            />
          }
          label={INFO_PAGE.ADD_I_CONSENT_AND_I_DO_NOT_CONSENT_TO_THE_BOTTOM}
        />
      </FormGroup>

      <FormGroup style={{ padding: "15px" }}>
        <FormControlLabel
          control={
            <Switch
              checked={isFinish}
              onChange={handleIsFinish}
              color="primary"
              name="consent"
              inputProps={{ "aria-label": "Render this page as a Finish page" }}
            />
          }
          label={"Make this page terminal"}
        />
      </FormGroup>

      <FormGroup style={{ padding: "15px" }}>
        <FormControlLabel
          control={
            <Switch
              checked={responseCode}
              onChange={handleResponseCode}
              color="primary"
              name="responseCode"
              inputProps={{
                "aria-label": "Generate six-digit completion code",
              }}
            />
          }
          label={"Generate six-digit completion code"}
        />
      </FormGroup>

      <Box component="span" className={classes.note} display="block">
        {INFO_PAGE.ADD_FAKE_POSTS_TO_THE_BOTTOM}
      </Box>

      <SocialMediaPages
        active={pageActive}
        setActive={setPageActive}
        templateId={templateId}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        color="primary"
        onClick={handleSave}
        startIcon={<IconDeviceFloppy />}
        className={clsx(classes.submit, classes.widthFitContent)}
      >
        Save
      </Button>
    </Container>
  );
};

export default InfoPage;
