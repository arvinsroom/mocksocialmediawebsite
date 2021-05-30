/* userQuestionAnswers */

// templateAdminPortalQuestionsData
// each item of this array should be type:questionId;questionText
export const formQuestionsIdsArray = (templateAdminPortalQuestionsData) => {
  // this function is used to make the array of all the question _ids
  const templateAllQuestionsData = [];
  const pageConfigAllQuestions = templateAdminPortalQuestionsData?.pageFlowConfigurations || [];
  for (let i = 0; i < pageConfigAllQuestions.length; i++) {
    const allPageQuestions = pageConfigAllQuestions[i].question || [];
    for (let j = 0; j < allPageQuestions.length; j++) {
      const item = pageConfigAllQuestions[i].type + ';' + allPageQuestions[j]._id + ';' + allPageQuestions[j].questionText;
      templateAllQuestionsData.push(item);
    }
  }
  return templateAllQuestionsData;
};

// const normalize = {
//   "questionId": {
//     "answers": ['option 1', 'option 2'],
//     "questioText": "This is some question?",
//     "type": "MCQ or OPENTEXT"
//   }
//   ...
// }
const normalizeUserQuestionAnswersHelper = (questionAnswers) => {
  const normalize = {};
  for (let i = 0; i < questionAnswers.length; i++) {
    const currentItem = questionAnswers[i];
    let answerText = '';
    if (currentItem.mcqOptionId) answerText = currentItem.mcqOption.optionText;
    else answerText = currentItem.opentextAnswerText;
    
    if (!normalize[currentItem.questionId]) normalize[currentItem.questionId] = '';
    normalize[currentItem.questionId] = normalize[currentItem.questionId] + answerText + ';';
  }
  return normalize;
};


// formulate the mcq answer spreadsheet
// This will get all the possible questionsID in questionAdminData for a specific template we are downloading the data
// then for each response we will pass in the user response for each user in questionResData
export const formulateQuestionAnswerSpreadSheet = (questionAdminData, questionResponseData) => {
  // first form the main question headers for all possible question (questionAdminData)
  // in the form of questionId;questionText
  // will form user response in ID form
  const normalizedQuestionData = normalizeUserQuestionAnswersHelper(questionResponseData);
  const eachRow = [];
  for (let i = 0; i < questionAdminData.length; i++) {
    // we found a question in normalized user response that means they answered it
    const questionId = questionAdminData[i].split(';')[1];
    const questionResponse = normalizedQuestionData[questionId];
    if (questionResponse) eachRow.push(questionResponse);
    else eachRow.push("");
  }
  return eachRow;
};

/* userGlobalTracking */

export const formGlobalSocialMediaPageIdsArray = (globalSocialMediaPages) => {
  // this function is used to make the array of all the question _ids
  const globalSocialMediaPagesData = [];
  const pageConfigAllSocialPages= globalSocialMediaPages?.pageFlowConfigurations || [];
  for (let i = 0; i < pageConfigAllSocialPages.length; i++) {
    const item = pageConfigAllSocialPages[i].type + ';' + pageConfigAllSocialPages[i]._id + ';' + pageConfigAllSocialPages[i].name + ';' + pageConfigAllSocialPages[i].pageDataOrder;
    globalSocialMediaPagesData.push(item);
  }
  return globalSocialMediaPagesData;
};

// this forms an object with page configurations as Ids and all there metadata in 
// connected with those ID's
const normalizeUserGlobalTracking = (allGlobalTracking) => {
  // try to dynamically add the page(s) configurations in the normalize array
  // Add only two things
  // 1) page type
  // 2) order of the posts
  const normalize = {};
  for (let i = 0; i < allGlobalTracking.length; i++) {
    // need pageCofiguration as only then we know that we have metadata to some specific page
    // we only care for FACEBOOK and TWITTER data
    const currentItem = allGlobalTracking[i]?.pageConfigurations || null;
    // make sure this stays consistent
    if (currentItem) {
      const dynamicField = currentItem.type.toLowerCase() + 'PostsOrderAdminIds';
      const metaData = allGlobalTracking[i].pageMetaData;
      if (metaData) {
        const parseMetaData = JSON.parse(allGlobalTracking[i].pageMetaData);
        normalize[currentItem._id] = JSON.stringify(parseMetaData[dynamicField]);
      }
    }
  }
  return normalize;
};

// display the final spreadsheet gloabl tracking data for each user by looking at the
// global admin data
export const formulateUserGlobalTracking = (globalAdminData, globalResponseData) => {
  // we need to form this while outputting the responses in excel sheet
  // will form in ID form
  const normalizedGlobalUserData = normalizeUserGlobalTracking(globalResponseData);
  const eachRow = [];
  for (let i = 0; i < globalAdminData.length; i++) {
    const socialMediaPageId = globalAdminData[i].split(';')[1];
    const socialMediaPageResponse = normalizedGlobalUserData[socialMediaPageId];
    // we found a question in normalized user response that means they answered it
    if (socialMediaPageResponse) eachRow.push(socialMediaPageResponse);
    else eachRow.push("");
  }
  return eachRow;
};

/* userPostTracking */

// we only need the user response data to formulate the final spreadsheet data here
// also for now we have linkclicks
// adminData should be like [ 'linkclicks' ]
const possiblePostTracking = ['LINKCLICK'];
export const formulateUserPostLinkClickTracking = (globalResponseData) => {
  // we need to form this while outputting the responses in excel sheet
  // will form in ID form
  let stringTempEntry = '';
  for (let i = 0; i < globalResponseData.length; i++) {
    // linkclick is always done on a post
    const currentItem = globalResponseData[i]?.userPosts || null;
    if (currentItem) stringTempEntry = stringTempEntry + (currentItem.adminPostId || currentItem._id) + ';';
  }
  return stringTempEntry;
};


/* userPostActions */

// comment are formulated as |postId;comment|
// any other action i.e. like or love is done as postId;postId ....
const normalizeUserPostActionsTracking = (globalActionsResponseData) => {
  const normalize = {};
  for (let i = 0; i < globalActionsResponseData.length; i++) {
    const currentAction = globalActionsResponseData[i].action;
    const currentPostData = globalActionsResponseData[i].userPosts;
    const postId = (currentPostData.adminPostId || currentPostData._id);

    normalize[currentAction] = (normalize[currentAction] || "") + postId + ';' + (globalActionsResponseData[i].comment || '-9999') + '|';
  }
  return normalize;
};

// manually form the array for all the possible actions and then add postId for that action
const possiblePostActions = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'COMMENT', 'TWEET', 'RETWEET'];
export const formulateUserPostActionsTracking = (postActionsResponseData) => {
  const eachRow = [];
  const normalizeUserPostActionsData = normalizeUserPostActionsTracking(postActionsResponseData);
  for (let i = 0; i < possiblePostActions.length; i++) {
    const result = normalizeUserPostActionsData[possiblePostActions[i]];
    if (result) eachRow.push(result);
    else eachRow.push("");
  }
  return eachRow;
};

/* UserPosts */

// PHOTO, VIDEO ... are formulated as |postId;postMessage;attachedMediaId;parentPostId|
const normalizeUserPosts = (responseUserPosts) => {
  const normalize = {};
  for (let i = 0; i < responseUserPosts.length; i++) {
    const currentPost = responseUserPosts[i];

    const sharePostId = currentPost.parentUserPost ? 
      (currentPost.parentUserPost.adminPostId || currentPost.parentUserPost._id) :
      '-9999';
    const postId = (currentPost.adminPostId || currentPost._id);
    const attachedMediaId = currentPost?.attachedMedia?.length > 0 ? (currentPost.attachedMedia[0]._id || '-9999') : '-9999';
    
    normalize[currentPost.type] = (normalize[currentPost.type] || "") + 
      postId + ';' +
      (currentPost.postMessage || "") + ';' +
      attachedMediaId + ';' +
      sharePostId + '|';
  }
  return normalize;
};

const possiblePostTypes= ['LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE'];
export const formulateUserPosts = (userPosts) => {
  // manually form the array for all the possible actions and then add postId for that action
  const normalizeUserPostsData = normalizeUserPosts(userPosts);
  const eachRow = [];
  for (let i = 0; i < possiblePostTypes.length; i++) {
    const result = normalizeUserPostsData[possiblePostTypes[i]];
    if (result) eachRow.push(result);
    else eachRow.push("");
  }
  return eachRow;
};

// templateId ==> accessCode
// qualtricsId ==> participantCode
// templateName ==> conditionName
// templateCode ==> conditionCode
// template _id ==> conditionId
const headersRef = [
  '_id', 'templateId', 'templateCode', 'qualtricsId', 'consent', 'startedAt', 'finishedAt', 'templateName', 'language'
];

const headers = [
  'uniqueResponseId', 'conditionId', 'accessCode', 'participantId', 'consent', 'startedAt', 'finishedAt', 'conditionName', 'language'
];

export const normalizeUserAndTemplateData = (userAndTemplateData) => {
  // go over the headersRef and fetch
  const eachRow = [];
  for (let i = 0; i < headersRef.length; i++) {
    const result = userAndTemplateData[headersRef[i]];
    if (result) eachRow.push(result);
    else eachRow.push("");
  }
  return eachRow;
}

export const formulateHeaders = (questionIdsDynamicArray, globalSocailMediaDynamicArray) => {
  // 1) headers
  // 2) questionIdsDynamicArray
  // 3) globalSocailMediaDynamicArray
  // 4) userPostActions
  // 5) userPostTracking
  // 6) userPosts
  return headers.concat(
      questionIdsDynamicArray,
      globalSocailMediaDynamicArray,
      possiblePostActions,
      possiblePostTracking,
      possiblePostTypes
    );
}