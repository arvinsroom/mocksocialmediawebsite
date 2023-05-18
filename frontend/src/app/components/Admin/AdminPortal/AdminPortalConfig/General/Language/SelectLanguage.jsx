import { FormControl, InputLabel, Select, MenuItem, Button } from '@material-ui/core';
import { updateTemplate } from "../../../../../../actions/template";
import { useDispatch } from "react-redux";
import { showErrorSnackbar, showInfoSnackbar } from '../../../../../../actions/snackbar';
import { GENERAL_PAGE, TEMPLATE } from '../../../../../../constants';
import { useState } from 'react';
import useStyles from '../../../../../style';
import clsx from 'clsx';
import { IconDeviceFloppy } from '@tabler/icons-react';

const SelectLanguage = ({ currentLanguages, templateId }) => {
  const [active, setActive] = useState("");
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleActiveLanguages = async (e) => {
    await setActive(e.target.value);
  };

  const resetValues = () => {
    setActive("");
  };

  const handleSubmit= async e => {
    e.preventDefault();
    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    try {
      // handle change of language here
      const data = {
        _id: templateId,
        language: active
      };
      if (active) {
        await dispatch(updateTemplate({ tempObj: data }, "Language has been selected successfully!"));
        resetValues();
      } else dispatch(showInfoSnackbar("Please select a language!"));
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
    <form onSubmit={handleSubmit} className={classes.form}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">{GENERAL_PAGE.SELECT_LANGUAGE_FOR_SOCIAL_MEDIA_UI}</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={active}
          disabled={currentLanguages === null}
          onChange={handleActiveLanguages}
          label="choose language for this template"
        >
          {currentLanguages?.length > 0 ? currentLanguages.map(name => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          )) : null}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={currentLanguages === null}
        startIcon={<IconDeviceFloppy />}
        className={clsx(classes.submit, classes.widthFitContent)}
        >
        {GENERAL_PAGE.SAVE_RESPONSES}
      </Button>
    </form>
    </>
  );
};

export default SelectLanguage;