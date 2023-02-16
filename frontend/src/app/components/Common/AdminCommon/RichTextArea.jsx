import { useEffect, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { MuiThemeProvider } from '@material-ui/core/styles'
import { createTheme } from '@material-ui/core/styles'
import MUIRichTextEditor from 'mui-rte';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import ColorLensIcon from '@material-ui/icons/ColorLens';

const controls = ["title", "bold", "italic", "underline", "strikethrough", "highlight",
"link", "media", "bulletList", "numberList", "quote", "code", "clear", "left-align",
"center-align", "right-align", "same-line", "white-color", "undo", "redo"];

const InlineLinkBlock = (props) => {
  return (
      <div style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
      }}>
        {props.children}
      </div>
  )
};

const InlineColorBlock = (props) => {
  return (
      <div style={{
          color: 'white'
      }}>
        {props.children}
      </div>
  )
};

export default function RichTextArea({ setRichText, clearRichText, defaultValue }) {
  const [defaultRichText, setDefaultRichText] = useState(defaultValue);
  const defaultTheme = createTheme();
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
        controls={controls}
        customControls={[
        {
          name: "left-align",
          icon: <FormatAlignLeftIcon />,
          type: "inline",
          inlineStyle: {
            display: 'flex',
            alignItems: 'left',
            justifyContent: 'left',
          }
        },
        {
          name: "center-align",
          icon: <FormatAlignCenterIcon />,
          type: "inline",
          inlineStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        },
        {
          name: "right-align",
          icon: <FormatAlignRightIcon />,
          type: "inline",
          inlineStyle: {
            display: 'flex',
            alignItems: 'right',
            justifyContent: 'right',
          }
        },
        {
          name: "same-line",
          icon: <LinearScaleIcon />,
          type: "block",
          blockWrapper: <InlineLinkBlock />
        },  
        {
          name: "white-color",
          icon: <ColorLensIcon />,
          type: "block",
          blockWrapper: <InlineColorBlock />
        }
      ]}
      />
    </MuiThemeProvider>
  );
}