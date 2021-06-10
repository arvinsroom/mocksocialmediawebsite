import MUIRichTextEditor from 'mui-rte';
export default function RenderRichTextArea({ richText }) {
  return (
    <>
      <MUIRichTextEditor
        readOnly={true}
        toolbar={false}
        defaultValue={richText}
      />
    </>
  );
}
