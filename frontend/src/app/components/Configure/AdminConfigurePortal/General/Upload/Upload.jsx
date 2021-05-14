import { useState, useRef } from 'react';
import { Button, Input, Typography, Box } from '@material-ui/core';
import useStyles from '../../../../style';
import { useDispatch } from "react-redux";
import { uploadMultipleFiles } from "../../../../../services/media-service";
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../../actions/snackbar';
import { GENERAL_PAGE } from '../../../../../constants';
import Progress from '../../../../Progress';
import SocialMediaPages from '../../../../socialMediaPages';

const Upload = ({ templateId }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState("");

  const classes = useStyles();
  const clearValues = useRef(null);
  const dispatch = useDispatch();

  const resetValues = () => {
    setSelectedFiles(null);
    clearValues.current.value = "";
  };

  const uploadFiles = async () => {
    if (selectedFiles && selectedFiles.length > 0) {
      let formData = new FormData();
      let totalFileSize = 0;
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
        totalFileSize += selectedFiles[i].size;
      }
      if (totalFileSize <= 20e6) {
        formData.append("pageId", active);
        await uploadMultipleFiles(formData);
        dispatch(showSuccessSnackbar(GENERAL_PAGE.SUCCESSFULLY_SAVED_LANGUAGE_AND_OR_MEDIA));
        resetValues();  
      } else {
        dispatch(showInfoSnackbar("Please upload file(s) of size less than 20MB."));
      }
    } else dispatch(showInfoSnackbar(GENERAL_PAGE.PLEASE_ENTER_A_VALID_RESPONSE));
  };

  const handleSubmit= async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await uploadFiles();
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        dispatch(showErrorSnackbar(resMessage));
    }
    setIsLoading(false);
  };

  const selectFiles = (e) => {
    setSelectedFiles(e.target.files);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.form}>
        <Box component="span" className={classes.note} display="block">
          You can either upload all files at once or small batches. Total file size limit is: 20MB. 
        </Box>
        <SocialMediaPages active={active} setActive={setActive} templateId={templateId}/>

        <Typography component="h6">
          {GENERAL_PAGE.UPLOAD_MEDIA_ASSOCIATED_WITH_POSTS}
        </Typography>
        <Input
          type="file"
          inputProps={{ multiple: true }}
          accept="image/*, video/*"
          disableUnderline={true}
          onChange={selectFiles}
          ref={clearValues}
        />
        {isLoading && <Progress />}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={active === ""}
          className={classes.submit}
          >
          {GENERAL_PAGE.SAVE_RESPONSES}
        </Button>
      </form>
    </>
  );
};

export default Upload;