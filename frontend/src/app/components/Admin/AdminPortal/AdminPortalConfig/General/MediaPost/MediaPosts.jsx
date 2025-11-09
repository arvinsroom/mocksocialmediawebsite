import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@material-ui/core";
import { IconDeviceFloppy, IconTableImport } from "@tabler/icons-react";
import clsx from "clsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import {
  showErrorSnackbar,
  showInfoSnackbar,
  showSuccessSnackbar,
} from "../../../../../../actions/snackbar";
import {
  GENERAL_PAGE,
  ORDER_TYPES,
  TEMPLATE,
  TEMPLATE_TYPES,
} from "../../../../../../constants";
import { create } from "../../../../../../services/media-service";
import useStyles from "../../../../../style";

const EXCEL_COLUMNS = 23;
/* list of supported file types */
const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

const MediaPosts = ({ templateId }) => {
  const [mediaJSON, setMediaJSON] = useState(null);
  const [authorJSON, setAuthorJSON] = useState(null);
  const [pageName, setPageName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [orderType, setOrderType] = useState("");
  const [uploadPostSpreadsheetName, setUploadPostSpreadsheetName] =
    useState("");
  const [uploadAuthorSpreadsheetName, setUploadAuthorSpreadsheetName] =
    useState("");
  const [omitInteractionBar, setOmitInteractionBar] = useState(false);

  const classes = useStyles();
  const dispatch = useDispatch();

  /**
   * Read the file uplodaded by the user and convert it to JSON.
   * @param {*} e  event
   * @param {*} sType AUTHOR or MEDIA
   *
   * Note:
   * We parse the first 23 columns (EXCEL_COLUMNS) of the excel sheet.
   *
   * Update:
   * readAsBinaryString is deprecated. Using readAsArrayBuffer instead.
   */
  const handleChange = (e, sType) => {
    e.preventDefault();
    let file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.size > 20e6) {
        dispatch(
          showInfoSnackbar("Please upload file of size less than 10MB.")
        );
      } else {
        if (sType === "MEDIA") setUploadPostSpreadsheetName(file.name);
        else setUploadAuthorSpreadsheetName(file.name); // sType === 'AUTHOR'
        let reader = new FileReader();
        reader.onload = function (e) {
          var data = new Uint8Array(e.target.result);
          let readedData = XLSX.read(data, { type: "array" });
          /* Get first worksheet */
          const wsname = readedData.SheetNames[0];
          const ws = readedData.Sheets[wsname];

          /* Convert array to json*/
          let dataParse = XLSX.utils.sheet_to_json(ws, {
            header: 1,
            blankrows: false,
            defval: null,
            blankCell: true,
          });
          // filter excel, and get only expected rows
          dataParse = dataParse.map((arr) => {
            return arr.splice(0, EXCEL_COLUMNS);
          });
          /* Update state */
          if (sType === "MEDIA") setMediaJSON(dataParse);
          else setAuthorJSON(dataParse); // sType === 'AUTHOR'
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const resetValues = () => {
    setPageName("");
    setTemplateType("");
    setOrderType("");
    setMediaJSON(null);
    setAuthorJSON(null);
    setOmitInteractionBar(false);
    setUploadPostSpreadsheetName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    } else {
      try {
        if (authorJSON && mediaJSON && pageName) {
          await create({
            name: pageName,
            type: templateType,
            pageDataOrder: orderType,
            templateId: templateId,
            mediaPosts: mediaJSON,
            omitInteractionBar,
            author: authorJSON,
          });
          dispatch(
            showSuccessSnackbar(
              GENERAL_PAGE.SUCCESSFULLY_UPLOADED_SOCIAL_MEDIA_SPREADSHEET
            )
          );
          resetValues();
        } else {
          dispatch(
            showInfoSnackbar(GENERAL_PAGE.PLEASE_ENTER_A_VALID_RESPONSE)
          );
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
    }
  };

  const handleType = (event) => {
    setTemplateType(event.target.value);
  };

  const handleOmitInteractionBar = (e) => {
    setOmitInteractionBar(e.target.checked);
  };

  const createMenuItems = () => {
    let menuItems = [];
    for (let item in TEMPLATE_TYPES) {
      menuItems.push(
        <MenuItem value={item} key={item}>
          {item}
        </MenuItem>
      );
    }
    return menuItems;
  };

  const handleOrder = (event) => {
    setOrderType(event.target.value);
  };

  const createMenuItemsOrder = () => {
    let menuItems = [];
    for (const [key, value] of Object.entries(ORDER_TYPES)) {
      menuItems.push(
        <MenuItem value={key} key={key}>
          {value}
        </MenuItem>
      );
    }
    return menuItems;
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.marginBottom}
          margin="normal"
          required
          fullWidth
          value={pageName}
          label={GENERAL_PAGE.PROVIDE_A_UNIQUE_NAME_FOR_SOCIAL_MEDIA}
          onChange={({ target }) => setPageName(target.value)}
          autoFocus
        />
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">
            {GENERAL_PAGE.SELECT_PLATFORM}
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            className={classes.marginBottom}
            value={templateType}
            onChange={handleType}
            label={GENERAL_PAGE.SELECT_PLATFORM}
          >
            {createMenuItems()}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">
            {GENERAL_PAGE.ORDER_OF_PRESENTATION_OF_POSTS}
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            className={classes.marginBottom}
            value={orderType}
            onChange={handleOrder}
            label={GENERAL_PAGE.ORDER_OF_PRESENTATION_OF_POSTS}
          >
            {createMenuItemsOrder()}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          component="label"
          startIcon={<IconTableImport />}
        >
          {GENERAL_PAGE.UPLOAD_AUTHOR_SPREADSHEET}
          <Input
            style={{ display: "none" }}
            disableUnderline={true}
            id="upload-file"
            type="file"
            inputProps={{ multiple: false }}
            accept={SheetJSFT}
            onChange={(e) => handleChange(e, "AUTHOR")}
          />
        </Button>
        <br />
        <p>
          {" Spreadsheet that will be uploaded upon clicking next step: " +
            (uploadAuthorSpreadsheetName || "")}
        </p>

        <Button
          variant="contained"
          component="label"
          startIcon={<IconTableImport />}
        >
          {GENERAL_PAGE.UPLOAD_POST_SPREADSHEET}
          <Input
            style={{ display: "none" }}
            disableUnderline={true}
            id="upload-file"
            type="file"
            inputProps={{ multiple: false }}
            accept={SheetJSFT}
            onChange={(e) => handleChange(e, "MEDIA")}
          />
        </Button>
        <br />
        <p>
          {" Spreadsheet that will be uploaded upon clicking next step: " +
            (uploadPostSpreadsheetName || "")}
        </p>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={omitInteractionBar}
                onChange={handleOmitInteractionBar}
                color="primary"
                name="consent"
                inputProps={{
                  "aria-label":
                    "Remove the ability for participants to interact (e.g., like, share, comment) with posts. Please note this only applies to parent posts.",
                }}
              />
            }
            label={
              "Remove the ability for participants to interact (e.g., like, share, comment) with posts. Please note this only applies to parent posts."
            }
          />
        </FormGroup>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!pageName && !mediaJSON}
          startIcon={<IconDeviceFloppy />}
          className={clsx(classes.submit, classes.widthFitContent)}
        >
          {GENERAL_PAGE.SAVE_RESPONSES}
        </Button>
      </form>
    </>
  );
};

export default MediaPosts;
