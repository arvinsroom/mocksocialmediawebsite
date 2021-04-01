import { useState, useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Button, Input, Typography } from '@material-ui/core';
import * as language from "../../../../services/language-service";
import useStyles from '../../../style';
import { useSelector, useDispatch } from "react-redux";
import * as UploadService from "../../../../services/file-upload-service";
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../actions/snackbar';
import { GENERAL_PAGE, TEMPLATE } from '../../../../constants';

const fileToArrayBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    resolve(event.target.result)
  };
  reader.readAsArrayBuffer(file);
});

const Upload = ({ currentLanguages }) => {
  const [activeId, setActiveId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);

  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);
  const clearValues = useRef(null);
  const dispatch = useDispatch();

  const handleActiveLanguages = async (e) => {
    await setActiveId(e.target.value);
  };

  const resetValues = () => {
    setSelectedFiles(null);
    setActiveId("");
    clearValues.current.value = "";
  };

  const handleSubmit= async e => {
    e.preventDefault();
    if (!templateId) {
      dispatch(showErrorSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    try {
      // handle change of language here
      const data = {
        templateId,
        currentActive: activeId
      };
      if (activeId) await language.updateIsActive(data);
      // upload all images videos here
      if (selectedFiles && selectedFiles.length > 0) {
        await uploadFiles();
      }
      if (!activeId && (!selectFiles || selectFiles.length < 1)) {
        dispatch(showInfoSnackbar(GENERAL_PAGE.PROVIDE_ALTEAST_SOME_DATA));
      } else dispatch(showSuccessSnackbar(GENERAL_PAGE.LANGUAGE_POST_UPLOAD));
      resetValues();
    } catch (error) {
      console.log(error.message);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        dispatch(showErrorSnackbar(resMessage));
    }
  };

  const selectFiles = (e) => {
    setSelectedFiles(e.target.files);
  }

  const uploadFiles = async () => {
    let formData = new FormData();
    // let data = null;
    // let createBlob = null;
    for (let i = 0; i < selectedFiles.length; i++) {
      // read the content as array buffer and create a blob with desired array buffer and type information
      // data = await fileToArrayBuffer(selectedFiles[i]);
      // createBlob = new Blob([data], {
      //   type: selectedFiles[i].type
      // });
      // console.log('createBlob: ', createBlob);
      formData.append("files", selectedFiles[i]);
    }
    // formData.append("blobdata", createBlob);
    // console.log('selectedFiles: ', selectedFiles);
    // console.log('dataUri: ', blobData);
    // formData.append("files", selectedFiles[i]);
    formData.append("templateId", templateId);
    return await UploadService.uploadMultipleFiles(formData);
  }

  return (
    <>
    <Box component="span" className={classes.note} display="block">
    <b>Note: </b> {GENERAL_PAGE.LANGUAGE_THUMBNAIL_NOTE}
    </Box>
    <Box component="span" className={classes.note} display="block">
      <b>Note: </b> {GENERAL_PAGE.TOO_MANY_FILES_AT_ONCE_NOTE}
    </Box>
    <div className={classes.paper}>
    <form onSubmit={handleSubmit} className={classes.form}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Languages</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={activeId}
          onChange={handleActiveLanguages}
          label="choose language for this template"
        >
          {currentLanguages && currentLanguages.length > 0 ? currentLanguages.map(row => (
            <MenuItem key={row._id} value={row._id}>{row._id !== "-1" ? "Use language " + row.name + " for platform " + row.platform : row.name}</MenuItem>
          )) : null}
        </Select>
      </FormControl>
      <Typography component="h6">
          Upload Images/videos: 
        </Typography>
      <Input
          type="file"
          inputProps={{ multiple: true }}
          accept="image/*, video/*"
          disableUnderline={true}
          onChange={selectFiles}
          ref={clearValues}
        />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className={classes.submit}
      >
        Save
      </Button>
    </form>
    </div>
    </>
  );
};

export default Upload;