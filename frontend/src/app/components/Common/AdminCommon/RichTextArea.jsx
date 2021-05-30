import { useEffect, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIRichTextEditor from 'mui-rte';

export default function RichTextArea({ setRichText, clearRichText }) {
  const [defaultRichText, setDefaultRichText] = useState();
  const defaultTheme = createMuiTheme();
  const emplyObj = JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent()));

  useEffect(() => {
    // if true, then set the value to empty state
    if (clearRichText) {
        setDefaultRichText(emplyObj);
    }
  }, [clearRichText]);

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

  const handleChange = async (state) => {
    await setRichText(JSON.stringify(convertToRaw(state.getCurrentContent())));
  };

  return (
    <MuiThemeProvider theme={defaultTheme}>
      <MUIRichTextEditor
        label="Type something here..."
        onChange={handleChange}
        defaultValue={defaultRichText}
      />
    </MuiThemeProvider>
  );
}
