export const TEMPLATE_TYPES = Object.freeze({
  FACEBOOK: "FACEBOOK",
  TWITTER: "TWITTER",
});

export const ORDER_TYPES = Object.freeze({
  ASC: "Ascending",
  DESC: "Descending",
  RANDOM: "Random"
});

export const REGISTER_PAGE_CUSTOM_FIELDS = Object.freeze({
  TEXT: "Text Field",
  NUMBER: "Number Field",
  EMAIL: "Email Field",
  IMAGE: 'Image Field',
  PASSWORD: 'Password Field',
  DATE: 'Date Field'
});

export const REGISTER_PAGE_CUSTOM_REFERENCES = Object.freeze({
  PROFILEPHOTO: "Profile Photo",
  EMAIL: "Email",
  USERNAME: "Username",
  REALNAME: "Real Name",
  PASSWORD: "Password",
  DATE: "Date",
  NUMBER: "Number",
  HANDLE: "Handle",
  RELATIONSHIP: "Relationship"
});

export const TEMPLATE = Object.freeze({
  SELECT_OR_CREATE_TEMPLATE: "Please make sure a template is created or selected.",
  CONDITION_SUCCESS: "Condition successfully created.",
  ASK_FOR_PERMISSION: "Configure permissions and other requests:",
  TEMPLATE_CURRENT_SELECT: "Successfully changed the active condition",
  TEMPLATE_DELETE_NOTE: "If you delete a condition, you will delete every page associated with that condition as well.",
  CURRENT_ACTIVE_CONDITION: 'Current active condition',
  PROVIDE_A_CONDITION_NAME: 'Provide a condition name',
  REQUIRE_PARTICIPANT_ID: 'Require Participant ID',
  CONDITION_NAME: 'Condition Name',
  SET_AS_ACTIVE: 'Set as Active',
  CHANGE_ACCESS_CODE: 'Change Access Code',
  ACCESS_CODE: 'Access Code',
  LANGUAGE: 'Language',
  DELETE: 'Delete'
});

export const REGISTER_PAGE = Object.freeze({
  PROVIDE_A_UNIQUE_PAGE_NAME: 'Provide a unique name for this registration page',
  SELECT_INFORMATION_REQUESTED_OF_PARTICIPANTS: 'Select what information will be requested of participants:',
  PROFILE_PHOTO: 'Profile photo',
  USERNAME: 'Username',
  SUCCESSFULLY_CREATED_REGISTRATION_PAGE: 'Successfully created registration page',
  PLEASE_ENTER_A_VALID_RESPONSE: 'Please enter a valid response.'
});

export const FLOW_PAGE = Object.freeze({
  FLOW_PAGE_SUCCESS: "Flow page was successfully configured.",

  FLOW_CONFIG_NOTE: "Order values should range from 1 to the total number of pages. An order value of 0 represents no order.",
  PAGE_NAME: 'Page Name',
  PAGE_TYPE: 'Page Type',
  SET_FLOW_ORDER: 'Change Flow Order',
  CURRENT_FLOW_ORDER: 'Current Flow Order'
});

export const DATA_PAGE = Object.freeze({
  CONDITION_ID: 'Condition ID',
  CONDITION_NAME: 'Condition Name',
  RESPONSES: 'Responses',
  NO_RESPONSE_YET: 'No responses yet.',
});

export const MCQ_PAGE = Object.freeze({
  PROVIDE_A_UNIQUE_PAGE_NAME: 'Provide a unique name for this multiple-choice page',
  TYPE_QUESTION_HERE: 'Type question here',
  TYPE_RESPONSE_OPTION_HERE: 'Type response option here',
  SUCCESSFULLY_CREATED_MULTIPLE_CHOICE_PAGE: 'Successfully created multiple-choice page',
  ANSWER_REQUIRED_QUESTIONS_TO_CONTINUE: 'Please answer all required questions to continue',
  PLEASE_ENTER_A_VALID_RESPONSE: 'Please enter a valid response.'
});

export const OPENTEXT_PAGE = Object.freeze({
  PROVIDE_A_UNIQUE_PAGE_NAME: 'Provide a unique name for this open-text question page',
  TYPE_QUESTION_HERE: 'Type question here',
  SUCCESSFULLY_CREATED_OPENTEXT_PAGE: 'Successfully created open-text question page',
  ANSWER_REQUIRED_QUESTIONS_TO_CONTINUE: 'Please answer all required questions to continue',
  PLEASE_ENTER_A_VALID_RESPONSE: 'Please enter a valid response.'
});

export const INFO_PAGE = Object.freeze({
  PROVIDE_A_UNIQUE_PAGE_NAME: 'Provide a unique name for this information page',
  SUCCESSFULLY_CREATED_INFORMATION_PAGE: 'Successfully created information page',
  ADD_I_CONSENT_AND_I_DO_NOT_CONSENT_TO_THE_BOTTOM: 'Add "I consent" and "I do not consent" options at the bottom of the page',
  ADD_FAKE_POSTS_TO_THE_BOTTOM: 'Select a social media page to use for the misinformation display (optional).',
  SELECT_SOCIAL_MEDIA_PAGE: 'SELECT SOCIAL MEDIA PAGE'
});

export const GENERAL_PAGE = Object.freeze({
  PROVIDE_A_UNIQUE_NAME_FOR_SOCIAL_MEDIA: 'Provide a unique name for this social media page',
  SELECT_PLATFORM: 'Select Platform',
  ORDER_OF_PRESENTATION_OF_POSTS: 'Order of presentation of posts',
  SUCCESSFULLY_UPLOADED_SOCIAL_MEDIA_SPREADSHEET: 'Successfully uploaded spreadsheet of social media posts',
  UPLOADING_A_NEW_SPREADSHEET_WILL_OVERWRITE: "Uploading a new language spreadsheet will overwrite any existing language spreadsheet.",
  
  SUCCESSFULLY_UPLOADED_LANGUAGE_SPREADSHEET: 'Successfully uploaded language spreadsheet',
  SELECT_LANGUAGE_FOR_SOCIAL_MEDIA_UI: 'Select language for the social media UI',
  SUCCESSFULLY_SAVED_LANGUAGE_AND_OR_MEDIA: 'Successfully saved language data and/or uploaded media',
  SAVE_RESPONSES: 'Save Responses',
  PLEASE_ENTER_A_VALID_RESPONSE: 'Please enter a valid response.',
  UPLOAD_POST_SPREADSHEET: 'UPLOAD POST SPREADSHEET',
  UPLOAD_AUTHOR_SPREADSHEET: 'UPLOAD AUTHOR SPREADSHEET',
  UPLOAD_POST_MEDIA: 'UPLOAD POST MEDIA',
  UPLOAD_AUTHOR_MEDIA: 'UPLOAD AUTHOR MEDIA',
  UPLOAD_LANGUAGE_SPREADSHEET: 'UPLOAD LANGUAGE SPREADSHEET'
});

export const FINISH_PAGE = Object.freeze({
  PROVIDE_A_UNIQUE_PAGE_NAME: 'Provide a unique name for this redirect page',
  TYPE_TEXT_ALONGSIDE_REDIRECTION_LINK: 'Type text to appear alongside the redirection link here',
  SUCCESSFULLY_CREATED_REDIRECT_PAGE: 'Successfully created redirect page',
  PROVIDE_A_REDIRECTION_LINK: 'Provide a redirection link'
});

export const CONFIGURE_PAGE = Object.freeze({
});

export const ADMIN_TAB_NAMES = Object.freeze({
  CONDITION_SETTINGS: 'Condition Settings',
  SOCIAL_MEDIA: 'Social Media',
  REGISTRATION: 'Registration',
  INFORMATION: 'Information',
  MULTIPLE_CHOICE: 'Multiple-choice',
  OPEN_TEXT: 'Open-text',
  REDIRECT: 'Redirect',
  STUDY_FLOW: 'Study Flow',
  DATA: 'Data'
});

export const USER_GENERAL = Object.freeze({
  SAVE_RESPONSE: 'Save responses',
  RESPONSES_SAVED: 'Responses saved',
});

export const USER_LOGIN = Object.freeze({
  SAVE_RESPONSE: 'Save responses',
  RESPONSES_SAVED: 'Responses saved',
});

export const FB_TRANSLATIONS_DEFAULT = Object.freeze({
  LIKE: 'Like',
  LOVE: 'Love',
  HAHA: 'Haha',
  ANGRY: 'Angry',
  SAD: 'Sad',
  WOW: 'Wow',

  CREATE: 'Create',
  COMMENT: 'Comment',
  POST: 'Post',
  SHARE: 'Share',
  WRITE_A_COMMENT: 'Write a comment...',
  WHATS_ON_YOUR_MIND: 'What\'s on your mind?',

  WRITE_POST: 'Write Post',
  CREATE_POST: 'Create Post',
  TAG_FRIENDS: 'Tag Friends',
  PHOTO: 'Photo',
  VIDEO: 'Video',
  FEELING: 'Feeling',
  ACTIVITY: 'Activity',
  ADD_TO_YOUR_POST: 'Add to Your Post',
  COMMENTS: 'Comments'
});

export const USER_TRANSLATIONS_DEFAULT = Object.freeze({
  SELECT_LANGUAGE: 'Please select your language',
  ACCESS_LOGIN_CODES: 'Please enter the access code and the participant code you got from Part 1 of the “Interacting with News on Social Media” study below, then click “Login.”',
  ACCESS_CODE: 'Access Code',
  PARTICIPANT_ID: 'Participant ID',
  INDICATE_YOUR_CHOICES: 'Please indicate your choice:',
  CLICK_TO_CONTINUE_STUDY: 'Click here to continue to the next part of this study',
  THANK_YOU:'Thank you!',
  RESPONSE_SUCCESSFULLY_RECORDED_CLOSE_TAB: 'Your response has been recorded, and you can safely close this page.',
  RESPONSE_SUCCESSFULLY_SAVED_EACH_PAGE: 'Successfully saved your responses on this page. Please continue to the next page.',
  ENTER_REQUIRED_INFO:'Please answer all required questions to continue.',
  TYPE_YOUR_ANSWER_HERE:'Type your answer here',
  SAVE_RESPONSES:'Save responses',
  CONTINUE: 'Continue',
  INCORRECT_ACCESS_LOGIN_CODES: 'Incorrect Access Code or Participant ID',
  ENTER_USERNAME_TO_CONTINUE:'Please enter a username to continue',
  UPLOAD_PIC_TO_CONTINUE: 'Please upload a profile photo to continue',
  SUCCESS: 'Success',
  ERROR:'Error',
  TRY_AGAIN: 'Try again',
  RESPONSES_SAVED: 'Responses saved',
  QUESTION: 'Question',
  ANSWER: 'Answer',
  PAGE: 'Page',
  PROVIDE_CONSENT:'Please indicate whether you consent to participate to continue.',
  LOGIN: 'Login',
  I_CONSENT:'I consent',
  I_DO_NOT_CONSENT:'I do not consent',
  PLEASE_UPLOAD_FILE_OF_SIZE_LESS_THAN_20MB: 'Please upload file of size less than 20MB.',
  PLEASE_ENTER_A_VALID_RESPONSE: 'Please enter a valid response.',
  UPLOAD: 'Upload',
  TYPE_YOUR_USERNAME_HERE: 'Type your username here',
  POSTED: 'Posted!',

  SHARED_POSTS: 'Shared posts',
  NO_SHARED_POSTS: 'No shared posts!',
  LIKED_OR_COMMENTED_POSTS: 'Liked or commented posts',
  NO_LIKED_OR_COMMENTED_POSTS: 'No liked or commented posts!',
  ACTION: 'Action',
  COMMENT: 'Comment',
  LIKE: 'Like',
  LOVE: 'Love',
  HAHA: 'Haha',
  ANGRY: 'Angry',
  SAD: 'Sad',
  WOW: 'Wow'
});

export const WINDOW_GLOBAL = Object.freeze({
  RELOAD_ALERT_MESSAGE: 'If you reload this page, you might loose the data, Are you sure?'
});

export const TW_TRANSLATIONS_DEFAULT = Object.freeze({
  HOME: 'Home',
  EXPLORE: 'Explore',
  NOTIFICATIONS: 'Notifications',
  MESSAGES: 'Messages',
  BOOKMARKS: 'Bookmarks',
  LISTS: 'Lists',
  PROFILE: 'Profile',
  MORE: 'More',

  WHATS_ON_YOUR_MIND: 'What\'s on your mind?',
  TWEET: 'Tweet',
  WHATS_HAPPENING: 'What\'s happening?',
  TWEET_YOUR_REPLY: 'Tweet your reply',
  ADD_A_COMMENT: 'Add a comment',
  YOU_RETWEETED: 'You Retweeted',
  RETWEET: 'Retweet',
  QUOTE_TWEET: 'Quote Tweet',
  UNDO_RETWEET: 'Undo Retweet',
  FRIENDS: 'friends',
  LIKED: 'liked',
  AND: 'and',
  OTHERS: 'others',
  REPORTED: 'Reported',
  REPORT: 'Report',
  RETWEETED: 'retweeted',
  PLEASE_LIMIT_CHARACTERS_TO_280: 'Please limit characters to 280',
  TOTAL_CHARACTERS: 'Total characters'
});

export const USER_REGISTER = Object.freeze({
  REGISTER_HANDLE_PARSING_ERROR: 'Handles can start with @ or nothing and must contain only alphanumeric characters and/or underscores, up to a maximum of 15 characters.'
});