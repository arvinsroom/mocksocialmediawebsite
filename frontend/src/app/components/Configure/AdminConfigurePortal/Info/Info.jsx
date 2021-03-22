import { TextField, Button } from '@material-ui/core';
import { useState } from 'react';
import { create } from '../../../../services/info-service';
import useStyles from '../../../style';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import React, { useRef} from 'react';
import MUIRichTextEditor from 'mui-rte';
import { EditorState, convertToRaw } from 'draft-js'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import { TEMPLATE, INFO_PAGE } from '../../../../constants';

const InfoPage = () => {
  const [richData, setRichData] = useState();
  const [pageName, setPageName] = useState("");

  const { isLoggedIn } = useSelector(state => state.auth);
  const { _id: templateId } = useSelector(state => state.template);
  const classes = useStyles();
  const editor = useRef(null);
  const defaultTheme = createMuiTheme();
	const dispatch = useDispatch();

  const resetValues = () => {
    const emplyObj = JSON.stringify(
      convertToRaw(EditorState.createEmpty().getCurrentContent()));
    setRichData(emplyObj);
    setPageName("");
  };


  const handleSave = async (data) => {
    if (!templateId) {
      dispatch(showErrorSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }

    const info = {
      templateId: templateId,
      name: pageName,
      type: "INFO",
      info: {
        richText: data,
      }
    };
    try {
      const { data } = await create(info);
      if (data._id) {
        dispatch(showSuccessSnackbar(INFO_PAGE.INFO_PAGE_SUCCESS));
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

  if (!isLoggedIn) {
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

  return (
    <>
    <div>
      <TextField
        margin="normal"
        required
        fullWidth
        value={pageName}
        label="Provide a unique Info page name"
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
      </div>
    </>
  )
}

export default InfoPage;