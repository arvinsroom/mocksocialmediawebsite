import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button, Input, Box } from '@material-ui/core';
import { create } from "../../../../../../services/language-service";
import { useDispatch } from "react-redux";
import useStyles from '../../../../../style';
import SelectLanguage from './SelectLanguage';
import { showErrorSnackbar, showInfoSnackbar, showSuccessSnackbar } from '../../../../../../actions/snackbar';
import { GENERAL_PAGE, TEMPLATE } from '../../../../../../constants';
import { IconLanguage, IconDeviceFloppy } from '@tabler/icons-react';
import clsx from 'clsx';

const Language = ({ disable, templateId }) => {
  const [languageJSON, setLanguageJSON] = useState(null);
  const [currentLanguages, setCurrentLanguages] = useState(null);
  const [uploadLanSpreadsheetName, setUploadLanSpreadsheetName] = useState("");

  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
  }, []);

  /* list of supported file types */
  const SheetJSFT = [ "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"]
  .map(function(x) {
    return "." + x;
  }).join(",");

  const handleChange = (e) => {
    e.preventDefault();
    let file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.size > 20e6) {
        dispatch(showInfoSnackbar("Please upload file of size less than 20MB."));
      } else {
        setUploadLanSpreadsheetName(file.name);
        let reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target.result;
          let readedData = XLSX.read(data, {type: 'binary'});
          /* Get first worksheet */
          const wsname = readedData.SheetNames[0];
          const ws = readedData.Sheets[wsname];

          /* Convert array to json*/
          let dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
          // filter excel, here only checking rows
          dataParse = dataParse.filter(arr => arr && arr.length > 0);
          /* Update state */
          setLanguageJSON(dataParse);
        };
        reader.readAsBinaryString(file);
      }
    }
  }

  const resetValues = () => {
    setLanguageJSON(null);
    setUploadLanSpreadsheetName("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    try {
      if (languageJSON) {
        const { data } = await create({ templateId: templateId, languageData: languageJSON});
        // data has languages array
        await setCurrentLanguages(data?.languages || null);
        dispatch(showSuccessSnackbar(GENERAL_PAGE.SUCCESSFULLY_UPLOADED_LANGUAGE_SPREADSHEET));
        resetValues();
      } else {
        dispatch(showInfoSnackbar(GENERAL_PAGE.PLEASE_ENTER_A_VALID_RESPONSE));
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

  return (
    <>
    <Box component="span" className={classes.note} display="block">
      <p>{GENERAL_PAGE.UPLOADING_A_NEW_SPREADSHEET_WILL_OVERWRITE}</p>
    </Box>
      <form onSubmit={handleSubmit}>
        <br/>
        <Button
          variant="contained"
          component="label"
          startIcon={<IconLanguage />}
        >
          {GENERAL_PAGE.UPLOAD_LANGUAGE_SPREADSHEET}
          <Input
            style={{ display: "none" }}
            disableUnderline={true}
            id="upload-files"
            type="file"
            inputProps={{ multiple: false }}
            accept={SheetJSFT}
            onChange={(e) => handleChange(e)}
            />
        </Button>
        <br/>
        <p>{" Spreadsheet that will be uploaded upon clicking next step: " + (uploadLanSpreadsheetName || "")}</p>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!languageJSON}
          startIcon={<IconDeviceFloppy />}
          className={clsx(classes.submit, classes.widthFitContent)}
        >
          {GENERAL_PAGE.SAVE_RESPONSES}
        </Button>
      </form>
      {<SelectLanguage currentLanguages={currentLanguages} templateId={templateId}/>}
    </>
    
  );
};

export default Language;
