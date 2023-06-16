import MUIRichTextEditor from 'mui-rte';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import ColorLensIcon from '@material-ui/icons/ColorLens';

const InlineLinkBlock = (props) => {
  return (
      <div style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center'
      }}>
        {props.children}
      </div>
  )
}

const InlineColorBlock = (props) => {
  return (
      <div style={{
          color: 'white'
      }}>
        {props.children}
      </div>
  )
}

export default function RenderRichTextArea({ richText, inheritFontSize }) {
  return (
    <>
      <MUIRichTextEditor
        readOnly={true}
        toolbar={false}
        defaultValue={richText}
        inheritFontSize={inheritFontSize ? inheritFontSize : false}
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
    </>
  );
}