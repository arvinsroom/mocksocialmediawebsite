import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button, Typography, Input, Divider, Box } from '@material-ui/core';
import * as language from "../../../../services/language-service";
import { useSelector, useDispatch } from "react-redux";
import useStyles from '../../../style';
import Upload from './Upload';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { GENERAL_PAGE, TEMPLATE } from '../../../../constants';

const Language = () => {
  const [languageJSON, setLanguageJSON] = useState(null);
  const [currentLanguages, setCurrentLanguages] = useState([]);
  const [prevActive, setPrevActive] = useState("");

  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);
  const dispatch = useDispatch();

  const fetchAllLanguages = async () => {
    const { data } = await language.getLanguages(templateId);
    // add a empty object at the beginning
    data?.unshift({
      _id: "-1",
      name: "None",
      platform: "",
      isActive: null
    });
    await setCurrentLanguages(data);

    // set the prev language update if any
    data.forEach(element => {
      if (element.isActive) {
        setPrevActive(element._id);
        return;
      }
    });
  }

  useEffect(() => {
    fetchAllLanguages();
  }, []);

  /* list of supported file types */
  const SheetJSFT = [ "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"]
  .map(function(x) {
    return "." + x;
  }).join(",");

  const handleChange = (e) => {
    e.preventDefault();

    let files = e.target.files;
    if (files && files.length > 0) {
      let f = files[0];
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
      reader.readAsBinaryString(f)
    }
  }

  const resetValues = () => {
    setLanguageJSON(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!templateId) {
      dispatch(showErrorSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    try {
      if (languageJSON) {
        await language.create({ templateId: templateId, languageData: languageJSON});
        dispatch(showSuccessSnackbar(GENERAL_PAGE.LANGUAGE_SUCCESS));
        resetValues();  
        // fetch all the updated languages
        await fetchAllLanguages();
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
      <b>Note: </b> {GENERAL_PAGE.UPDATE_LAN_SPREADSHEET_SAME_TEMP_ID}
    </Box>
    <Box component="span" className={classes.note} display="block">
      <b>Note: </b> Make sure to have MOCK language data in only one file across multiple language spreadsheet for different templates.
    </Box>
    <div className={classes.paper}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <Typography component="h6">
          Language Spreadsheet
        </Typography>
        <Input
          type="file"
          disableUnderline={true}
          accept={SheetJSFT}
          onChange={(e) => handleChange(e)}
        />
        <Divider className={classes.divider}/>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!languageJSON}
          className={classes.submit}
        >
          Save
        </Button>
      </form>
      </div>
      <Box component="span" className={classes.note} display="block">
        <b>Note: </b> {GENERAL_PAGE.SELECT_LANGUAGE_DATA_APPEAR}
      </Box>
      <Box component="span" className={classes.note} display="block">
        <b>Note: </b> {GENERAL_PAGE.SELECT_LANGUAGE_OVERWRIGHT_NOTE}
      </Box>
      {currentLanguages && 
      <Upload currentLanguages={currentLanguages}/>}
    </>
  );
};

export default Language;
