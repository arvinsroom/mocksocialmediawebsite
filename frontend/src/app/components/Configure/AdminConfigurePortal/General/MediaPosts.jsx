import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, Typography, Input, Divider, TextField, FormControl, MenuItem, InputLabel, Select } from '@material-ui/core';
import * as media from "../../../../services/mediapost-service";
import { useSelector, useDispatch } from "react-redux";
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { GENERAL_PAGE, TEMPLATE } from '../../../../constants';
import { TEMPLATE_TYPES, ORDER_TYPES } from '../../../../constants';

const MediaPosts = () => {
  const [mediaJSON, setMediaJSON] = useState(null);
  const [pageName, setPageName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [orderType, setOrderType] = useState("");

  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);
  const dispatch = useDispatch();

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
        setMediaJSON(dataParse);
      };
      reader.readAsBinaryString(f)
    }
  }

  const resetValues = () => {
    setPageName("");
    setTemplateType("");
    setOrderType("");
    setMediaJSON(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!templateId) {
      dispatch(showErrorSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    try {
      if (mediaJSON && pageName) {
        await media.create({ name: pageName, type: templateType, pageDataOrder: orderType, templateId: templateId, mediaPosts: mediaJSON});
        dispatch(showSuccessSnackbar(GENERAL_PAGE.MEDIA_SUCCESS));
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

  const handleType = (event) => {
    setTemplateType(event.target.value);
  };

  const createMenuItems = () => {
    let menuItems = [];
    for (let item in TEMPLATE_TYPES) {
      menuItems.push(<MenuItem value={item} key={item}>{item}</MenuItem>)
    }
    return menuItems;
  }

  const handleOrder = (event) => {
    setOrderType(event.target.value);
  };

  const createMenuItemsOrder = () => {
    let menuItems = [];
    for (let item in ORDER_TYPES) {
      menuItems.push(<MenuItem value={item} key={item}>{item}</MenuItem>)
    }
    return menuItems;
  }

  return (
    <>
    <div className={classes.paper}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          className={classes.marginBottom}
          margin="normal"
          required
          fullWidth
          value={pageName}
          label="Provide a unique Social Media page name"
          onChange={({ target }) => setPageName(target.value)}
          autoFocus
        />
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Choose Social Media Template Type</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            className={classes.marginBottom}
            value={templateType}
            onChange={handleType}
            label="Choose Social Media Template Type"
          >
            {createMenuItems()}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Choose Posts Order</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            className={classes.marginBottom}
            value={orderType}
            onChange={handleOrder}
            label="Choose Posts Order"
          >
            {createMenuItemsOrder()}
          </Select>
        </FormControl>

        <Typography component="h6">
          Social Media Post Spreadsheet
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
          disabled={!pageName && !mediaJSON}
          className={classes.submit}
        >
          Save
        </Button>    
      </form>
    </div>
    </>
  );
};

export default MediaPosts;
