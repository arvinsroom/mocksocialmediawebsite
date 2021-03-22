export const TEMPLATE_TYPES = Object.freeze({
  FACEBOOK: "FACEBOOK"
});

export const TEMPLATE = Object.freeze({
  SELECT_OR_CREATE_TEMPLATE: "Please make sure a template is created or selected.",
  TEMPLATE_SUCCESS: "Template Successfully created.",
  TEMPLATE_CURRENT_SELECT: "Template Id set, can modify any page related to current template Id.",
  TEMPLATE_DELETE_NOTE: "Please be very careful when deleting a Template, this will delete every page associated with deleted template Id.",
});

export const REGISTER_PAGE = Object.freeze({
  REGISTER_PAGE_SUCCESS: "Register page was successfully created.",
  REGISTRATION_DETAILS: "Please provide additional requests for registrations?",
});

export const FLOW_PAGE = Object.freeze({
  FLOW_PAGE_SUCCESS: "Flow page was successfully configured.",
  FLOW_CONFIG_NOTE: "Please make sure the order is a value from 1 to # of pages. 0 represent a no order.",
});

export const MCQ_PAGE = Object.freeze({
  MCQ_PAGE_SUCCESS: "MCQ questions with respective pages were successfully created."
});

export const OPENTEXT_PAGE = Object.freeze({
  OPENTEXT_PAGE_SUCCESS: "Opentext questions with respective pages were successfully created."
});

export const INFO_PAGE = Object.freeze({
  INFO_PAGE_SUCCESS: "INFO page was successfully created."
});

export const GENERAL_PAGE = Object.freeze({
  MEDIA_SUCCESS: "Social Media post data successfully created.",
  LANGUAGE_SUCCESS: "Language data successfully created.",
  LANGUAGE_DATA_ALREADY_SAVED: "This language was previously saved.",
  LANGUAGE_POST_UPLOAD: "Language and/or Thumbnails were uploaded.",
  LANGUAGE_THUMBNAIL_NOTE: "Once you upload the Language and Socialmedia Post data, then you can choose language and upload any thumbnails required.",
  SELECT_LANGUAGE_OVERWRIGHT_NOTE: "Making change to Languages will overwrite previous selected language, if any.",
  TOO_MANY_FILES_AT_ONCE_NOTE: "If uploading is unsuccessful for posts, try to upload in smaller batches. Also make sure the ID defined in the post matches the file name.",
  SELECT_LANGUAGE_DATA_APPEAR: "Previous language data will appear below.",
  PROVIDE_ALTEAST_SOME_DATA: "Please provide either new language config or upload some image/video.",
  UPDATE_LAN_SPREADSHEET_SAME_TEMP_ID: "Updating Language spreadsheet will delete previous language data before loading new."
});

export const FINISH_PAGE = Object.freeze({
  FINISH_PAGE_SUCCESS: "Finish page was successfully created."
});

export const CONFIGURE_PAGE = Object.freeze({
});