import { useState, useRef } from 'react';
import { Box, Button, Input, Typography } from '@material-ui/core';
import useStyles from '../../../../style';
import { useDispatch } from "react-redux";
import { uploadMultipleFiles } from "../../../../../services/media-service";
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../../actions/snackbar';
import { GENERAL_PAGE, TEMPLATE } from '../../../../../constants';
import Progress from '../../../../Progress';

const Upload = ({ postMetaData }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const clearValues = useRef(null);
  const dispatch = useDispatch();

  const resetValues = () => {
    setSelectedFiles(null);
    clearValues.current.value = "";
  };

  const handleSubmit= async e => {
    e.preventDefault();
    if (!postMetaData) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    setIsLoading(true);
    try {
      // upload all images videos here
      if (selectedFiles && selectedFiles.length > 0) {
        await uploadFiles();
        dispatch(showSuccessSnackbar(GENERAL_PAGE.SUCCESSFULLY_SAVED_LANGUAGE_AND_OR_MEDIA));
        resetValues();
      }
      else dispatch(showInfoSnackbar(GENERAL_PAGE.PLEASE_ENTER_A_VALID_RESPONSE));
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

  const uploadFiles = async () => {
    let formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
    formData.append("postMetaData", JSON.stringify(postMetaData));
    return await uploadMultipleFiles(formData);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.form}>
        <Typography component="h6">
          {GENERAL_PAGE.UPLOAD_MEDIA_ASSOCIATED_WITH_POSTS}
        </Typography>
        <Input
          type="file"
          disabled={postMetaData === null}
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
          disabled={postMetaData === null}
          className={classes.submit}
          >
          {GENERAL_PAGE.SAVE_RESPONSES}
        </Button>
      </form>
    </>
  );
};

export default Upload;