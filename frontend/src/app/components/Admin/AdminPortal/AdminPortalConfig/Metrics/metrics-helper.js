import { escapeChars } from "../../../../../utils";

/* userQuestionAnswers */

// each item of this array should be type:questionId;questionText
export const formQuestionsIdsArray = (templateAdminPortalQuestionsData) => {
  const templateAllQuestionsData = [];
  const pageConfigAllQuestions = templateAdminPortalQuestionsData?.pageFlowConfigurations || [];
  for (let i = 0; i < pageConfigAllQuestions.length; i++) {
    const allPageQuestions = pageConfigAllQuestions[i].question || [];
    for (let j = 0; j < allPageQuestions.length; j++) {
      const item = pageConfigAllQuestions[i].type + "!~*!" + allPageQuestions[j]._id + "!~*!" + escapeChars(allPageQuestions[j].questionText);
      templateAllQuestionsData.push(item);
    }
  }
  return templateAllQuestionsData;
};

// Structure answerText!~*!answerText
const normalizeUserQuestionAnswersHelper = (questionAnswers) => {
  const normalize = {};
  for (let i = 0; i < questionAnswers.length; i++) {
    const currentItem = questionAnswers[i];
    let answerText = "";
    if (currentItem.mcqOptionId) answerText = escapeChars(currentItem.mcqOption.optionText);
    else answerText = escapeChars(currentItem.opentextAnswerText);
    
    if (!normalize[currentItem.questionId]) normalize[currentItem.questionId] = "";
    normalize[currentItem.questionId] = normalize[currentItem.questionId] + answerText + "!~*!";
  }
  return normalize;
};

export const formulateQuestionAnswerSpreadSheet = (questionAdminData, questionResponseData) => {
  // questionId;questionText
  const normalizedQuestionData = normalizeUserQuestionAnswersHelper(questionResponseData);
  const eachRow = [];
  for (let i = 0; i < questionAdminData.length; i++) {
    // we found a question in normalized user response that means they answered it
    const questionId = questionAdminData[i].split("!~*!")[1];
    const questionResponse = normalizedQuestionData[questionId];
    if (questionResponse) eachRow.push(questionResponse);
    else eachRow.push("");
  }
  return eachRow;
};

/* userSocialMediaPages */

export const formSocialMediaPageIdsArray = (globalSocialMediaPages) => {
  // this function is used to make the array of all the question _ids
  const globalSocialMediaPagesData = [];
  const pageConfigAllSocialPages= globalSocialMediaPages?.pageFlowConfigurations || [];
  for (let i = 0; i < pageConfigAllSocialPages.length; i++) {
    const item = pageConfigAllSocialPages[i].type + "!~*!" + pageConfigAllSocialPages[i]._id + "!~*!" + escapeChars(pageConfigAllSocialPages[i].name) + "!~*!" + pageConfigAllSocialPages[i].pageDataOrder;
    globalSocialMediaPagesData.push(item);
  }
  return globalSocialMediaPagesData;
};

/* userGlobalTracking
  Structure: startedTime!~*!postsOrderAdminId!~*!finishedTime
*/
const normalizeUserGlobalTracking = (allGlobalTracking) => {
  const normalize = {};
  for (let i = 0; i < allGlobalTracking.length; i++) {
    const currentItem = allGlobalTracking[i]?.pageConfigurations || null;
    if (currentItem) {
      const metaData = allGlobalTracking[i].pageMetaData || null;
      let finishTime = "-9999";
      let orderPosts = "-9999";
      let startTime = escapeChars(allGlobalTracking[i].createdAt);
      if (metaData) {
        const parseMetaData = JSON.parse(allGlobalTracking[i].pageMetaData);
        finishTime = escapeChars(parseMetaData['finishedAt']);
        if (finishTime !== "-9999") {
          let timeArray = finishTime.split(' ');
          if (timeArray && timeArray.length > 1) finishTime = timeArray[0] + 'T' + timeArray[1] + 'Z';
        }
        orderPosts = escapeChars(JSON.stringify(parseMetaData['facebookPostsOrderAdminIds'])) ||  "-9999";
      }
      normalize[currentItem._id] = startTime + "!~*!" + orderPosts + "!~*!" + finishTime;
    }
  }
  return normalize;
};

export const formulateUserGlobalTracking = (globalAdminData, globalResponseData) => {
  const normalizedGlobalUserData = normalizeUserGlobalTracking(globalResponseData);
  const eachRow = [];
  for (let i = 0; i < globalAdminData.length; i++) {
    const socialMediaPageId = globalAdminData[i].split("!~*!")[1];
    const socialMediaPageResponse = normalizedGlobalUserData[socialMediaPageId];
    // we found a question in normalized user response that means they answered it
    if (socialMediaPageResponse) eachRow.push(socialMediaPageResponse);
    else eachRow.push("");
  }
  return eachRow;
};

/* userPostTracking */
// Action are formulated as postId|$|postId
const normalizeUserPostTracking = (globalTrakingResponseData) => {
  const normalize = {};
  for (let i = 0; i < globalTrakingResponseData.length; i++) {
    const currentAction = globalTrakingResponseData[i].action;
    const createdAtTime = globalTrakingResponseData[i].createdAt;
    const currentPostData = globalTrakingResponseData[i].userPosts;
    const postId = (currentPostData.adminPostId || currentPostData._id);
    if (!normalize[currentAction]) normalize[currentAction] = "";
    normalize[currentAction] = normalize[currentAction] + postId + "!~*!" + createdAtTime + "|$|";
  }
  return normalize;
};

const possiblePostTracking = ['LINKCLICK', 'SEEWHY', 'SHAREANYWAY', 'SEEPHOTO', 'SEEVIDEO', 'SEELINK'];
export const formulateUserPostLinkClickTracking = (globalResponseData) => {
  const eachRow = [];
  const normalizeUserPostTrackingData = normalizeUserPostTracking(globalResponseData);
  for (let i = 0; i < possiblePostTracking.length; i++) {
    const result = normalizeUserPostTrackingData[possiblePostTracking[i]];
    if (result) eachRow.push(result);
    else eachRow.push("");
  }
  return eachRow;
};


/* userPostActions */
// comments are formulated as  postId!~*!comment|$|
// any other action as postId|$|postId
const normalizeUserPostActionsTracking = (globalActionsResponseData) => {
  const normalize = {};
  for (let i = 0; i < globalActionsResponseData.length; i++) {
    const currentAction = globalActionsResponseData[i].action;
    const currentPostData = globalActionsResponseData[i].userPosts;
    const postId = (currentPostData.adminPostId || currentPostData._id);
    if (!normalize[currentAction]) normalize[currentAction] = "";
    if (currentAction === 'COMMENT') normalize[currentAction] = normalize[currentAction] + postId + "!~*!" + escapeChars(globalActionsResponseData[i].comment) + "|$|";
    else normalize[currentAction] = normalize[currentAction] + postId + "|$|";
  }
  return normalize;
};

// manually form the array for all the possible actions and then add postId for that action
const possiblePostActions = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'COMMENT', 'REPORT'];
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

// PHOTO, VIDEO, TEXT, ... are formulated as postId!~*!postMessage!~*!attachedMediaId!~*!parentPostId|$|
const normalizeUserPosts = (responseUserPosts) => {
  const normalize = {};
  for (let i = 0; i < responseUserPosts.length; i++) {
    const currentPost = responseUserPosts[i];

    let dynamicPostID = currentPost.parentUserPost ? (currentPost.parentUserPost.adminPostId || currentPost.parentUserPost._id) : "-9999";
    let dynamicPostType = currentPost.type || "-9999";
    if (currentPost.isReplyTo) {
      dynamicPostType = "REPLYTO";
      dynamicPostID = currentPost.isReplyTo;
    }
    if (currentPost.quoteTweetTo) {
      dynamicPostType = "QUOTETWEET";
      dynamicPostID = currentPost.quoteTweetTo;
    }
    const postId = (currentPost.adminPostId || currentPost._id);
    const attachedMediaId = currentPost?.attachedMedia?.length > 0 ? (currentPost.attachedMedia[0]._id || "-9999") : "-9999";
    normalize[dynamicPostType] = (normalize[dynamicPostType] || "") + postId + "!~*!" + escapeChars(currentPost.postMessage) + "!~*!" + attachedMediaId + "!~*!" + dynamicPostID + "|$|";
  }
  return normalize;
};

const possiblePostTypes= ['LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE', 'RETWEET', 'QUOTETWEET', 'REPLYTO', 'UNDORETWEET'];
export const formulateUserPosts = (userPosts) => {
  // manually form the array for all the possible post types and then add postId for that action
  const normalizeUserPostsData = normalizeUserPosts(userPosts);
  const eachRow = [];
  for (let i = 0; i < possiblePostTypes.length; i++) {
    const result = normalizeUserPostsData[possiblePostTypes[i]];
    if (result) eachRow.push(result);
    else eachRow.push("");
  }
  return eachRow;
};

const possibleRegisterTypes= ['REGISTRATION'];
// structure: userRegisterId!~*!type!~*!displayName!~*!referenceName!~*!generalFieldValue!$!
export const formulateRegistrations = (userRegistrations) => {
  let retStr = "";
  if (userRegistrations) {
    for (let i = 0; i < userRegistrations.length; i++) {
      const userRegisterId = userRegistrations[i]?._id || "-9999";
      const registerDetails = userRegistrations[i]?.Register || {};
      const displayName = registerDetails?.displayName || "-9999";
      const referenceName = registerDetails?.referenceName || "-9999";
      const type = registerDetails?.type || "-9999";
      const generalFieldValue = escapeChars(userRegistrations[i]?.generalFieldValue);

      retStr = retStr + userRegisterId + "!~*!" + type + "!~*!" + displayName + "!~*!" + referenceName + "!~*!" + generalFieldValue + "|$|";
    }
  }
  return retStr;
};

// templateId ==> accessCode
// qualtricsId ==> participantCode
// templateName ==> conditionName
// templateCode ==> conditionCode
// template _id ==> conditionId
const headersRef = [
  '_id', 'responseCode', 'templateId', 'templateCode', 'qualtricsId', 'consent', 'startedAt', 'finishedAt', 'templateName', 'language'
];

const headers = [
  'uniqueResponseId', 'responseCode', 'conditionId', 'accessCode', 'participantId', 'consent', 'startedAt', 'finishedAt', 'conditionName', 'language'
];

export const formUserAndTemplateData = (userResponse, template) => {
  const userAndTemplateData = {
    ...userResponse,
    ...template,
  };
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
  // 7) userRegistrations
  return headers.concat(
    questionIdsDynamicArray,
    globalSocailMediaDynamicArray,
    possiblePostActions,
    possiblePostTracking,
    possiblePostTypes,
    possibleRegisterTypes
  );
}

export const normalizeMediaData = (users) => {
  const eachMedia = [];
  for (let i = 0; i < users.length; i++) {
    // check the user posts for each user
    const userPosts = users[i]?.userPosts || [];
    const userRegistrations = users[i]?.userRegisterations || [];
    if (userPosts.length > 0) {
      // there were some posts for ith user
      // go over each post
      for(let j = 0; j < userPosts.length; j++) {
        // check if each user posts have some attached media
        const attachedMedia = userPosts[j]?.attachedMedia || [];
        if (attachedMedia.length > 0) {
          // we do have some attached media
          for (let k = 0; k < attachedMedia.length; k++) eachMedia.push(attachedMedia[k]);
        }
      }
    }

    if (userRegistrations.length > 0) {
      // there were some posts for ith user
      // go over each post
      for(let j = 0; j < userRegistrations.length; j++) {
        // check if each user posts have some attached media
        if (userRegistrations[j].media !== null && userRegistrations[j].mimeType !== null) {
          eachMedia.push(userRegistrations[j]);
        }
      }
    }
  }
  return eachMedia;
}