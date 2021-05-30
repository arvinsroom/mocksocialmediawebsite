import MUIRichTextEditor from 'mui-rte';
import { Container } from '@material-ui/core';
import useStyles from '../../style';

export default function RenderRichTextArea({ richText }) {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md" className={classes.card}>
      <MUIRichTextEditor
        readOnly={true}
        toolbar={false}
        defaultValue={richText}
      />
    </Container>
  );
}
