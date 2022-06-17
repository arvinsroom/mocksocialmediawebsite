import { EditorState, convertToRaw } from 'draft-js';
import _ from 'lodash';

// returns true if rich text is empty or null
// else false
export const checkIfEmptyRichText = (richTextState) => {
  if (!richTextState) return true;

  // parse the incoming rich text state
  const parsedRichTextObject = JSON.parse(richTextState);
  // parse the empty editor state
  const parsedEmptyObject = convertToRaw(EditorState.createEmpty().getCurrentContent());

  // delete key properties as that is the only thing which can be different
  // from both and then compare these objects
  delete parsedRichTextObject.blocks[0].key;
  delete parsedEmptyObject.blocks[0].key;

  return _.isEqual(parsedEmptyObject, parsedRichTextObject);
}

// escape new line and double quote(s)
export const escapeChars = (str) => {
  if (!str) return "-9999"; // special case
  return str.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/"/g, '\'');
}

export const parseNumber = (str) => {
  if (!str) return null;
  const num = parseInt(str);
  return num !== NaN ? num : null;
}

export const getCurrentUTCTime = () => new Date().toISOString().replace('Z', '').replace('T', ' ');

export const removePropery = (prop, { [prop]: exclProp, ...rest }) => rest;
