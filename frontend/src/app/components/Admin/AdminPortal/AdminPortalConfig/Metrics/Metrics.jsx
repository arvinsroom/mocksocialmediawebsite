import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container
} from '@material-ui/core';
import { useEffect, useState, useRef } from 'react';
import {
  getAdminTemplatesWithUserCount,
  // fetchTemplateData,
  fetchTemplateDataAllUser,
  fetchTemplateDataSocialMedia,
  fetchTemplateDataQuestionData,
  downloadMediaData
} from '../../../../../services/metrics-service';
import { IconTableExport, IconDatabaseExport, IconFileExport } from '@tabler/icons';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../../style';
import { showErrorSnackbar, showInfoSnackbar } from '../../../../../actions/snackbar';
import { CSVLink } from "react-csv";
import { DATA_PAGE } from '../../../../../constants';
import Progress from '../../../../Common/Progress';
import { 
  formUserAndTemplateData,
  formQuestionsIdsArray,
  formulateQuestionAnswerSpreadSheet,
  formSocialMediaPageIdsArray,
  formulateUserGlobalTracking,
  formulateUserPostActionsTracking,
  formulateUserPostLinkClickTracking,
  formulateUserPosts,
  formulateHeaders,
  normalizeMediaData,
  formulateRegistrations
} from './metrics-helper';
import JSZip from 'jszip';
import saveAs from 'save-as';

const Template = () => {
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const [tempWithUsersCount, setTempWithUsersCount] = useState(null);
  const [allUserResponses, setAllUserResponses] = useState([]);
  const [downloadFileName, setDownloadFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const classes = useStyles();
  const dispatch = useDispatch();
  const csvLinkRef = useRef(null);


  const fetch = async () => {
    try {
      const { data } = await getAdminTemplatesWithUserCount();
      // we have data.data, data.userPosts, data.adminPosts
      setTempWithUsersCount(data?.response || null);
    } catch (error) {
      dispatch(showErrorSnackbar("Some error occured while fetching template and user information. Please Refresh the page!"))
    }
  };

  useEffect(() => {
    fetch();
  }, []);


  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }
  
  const downloadTemplateMedia = async (templateId, templateName, e) => {
    e.preventDefault();
    await setIsLoading(true);
    const { data } = await downloadMediaData(templateId);
    const allMedia = normalizeMediaData(data);
    if (allMedia?.length > 0) {
      const zip = new JSZip();
      let count = 0;
      const zipFilename = templateName + "-media.zip";
      allMedia.forEach(async function (fileObj) {
        try {
          const mimeTypeExt = fileObj.mimeType.split('/');
          const fileName = fileObj._id + "." + (mimeTypeExt[mimeTypeExt.length - 1] || "");
          zip.file(fileName, fileObj.media.data, { binary: true });
          count++;
          if(count === allMedia.length) {
            zip.generateAsync({ type:'blob' }).then(function(content) {
              saveAs(content, zipFilename);
            });
          }
        } catch (err) {
          // log the error but download how much it can
          dispatch(showErrorSnackbar("Some error occured! Only partial files have been download!"));
          zip.generateAsync({ type:'blob' }).then(function(content) {
            saveAs(content, zipFilename);
          });
          await setIsLoading(false);
        }
      });
    }
    else dispatch(showInfoSnackbar("No attached media found!"));
    await setIsLoading(false);
  }

  const downloadSpecificTemplate = async (templateId, templateName, type, e) => {
    e.preventDefault();
    try {
      await setIsLoading(true);
      // reduce load for fetching template data
      const { data: userData } = await fetchTemplateDataAllUser(templateId);
      const { data: socialMediaData } = await fetchTemplateDataSocialMedia(templateId);
      const { data: questionData } = await fetchTemplateDataQuestionData(templateId);
      // this is JSON for all user data
      const allUserData = userData?.allUserData || [];
      const socialMediaPageData = socialMediaData?.socialMediaPageData || null;
      const templateAdminPortalQuestionsData = questionData?.templateAdminPortalQuestionsData || null;
      // set the response as it it
      if (allUserData.length > 0) {
        if (type === 'JSON') {
          const json = JSON.stringify(allUserData);
          const blob = new Blob([json],{ type:'application/json' });
          const href = await URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = href;
          link.download = templateName.toString() + ".json";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (type === 'CSV') {
          // normalize the socialMediaPageIdsArray to make dynamic headers
          const socailMediaDynamicArray = formSocialMediaPageIdsArray(socialMediaPageData);
      
          // normalize the templateAdminPortalQuestionsData to make dynamic headers
          const questionIdsDynamicArray = formQuestionsIdsArray(templateAdminPortalQuestionsData);
      
          const spreadsheetData = [];
          // initially push the dynamic headers array
          const mainHeadersDynamicArray = formulateHeaders(questionIdsDynamicArray, socailMediaDynamicArray);
          spreadsheetData.push(mainHeadersDynamicArray);

          // fetch all the data from all the user responses and align them
          for (let i = 0; i < allUserData.length; i++) {
            // fetch individual user response
            const {
              template,
              userQuestionAnswers,
              userGlobalTracking,
              userPosts,
              userPostActions,
              userPostTracking,
              userRegisterations,
              ...userResponse
            } = allUserData[i];

            const eachRow = [
              ...formUserAndTemplateData(userResponse, template),
              // userQuestionAnswers
              ...formulateQuestionAnswerSpreadSheet(questionIdsDynamicArray, userQuestionAnswers),
              // userGlobalTracking
              ...formulateUserGlobalTracking(socailMediaDynamicArray, userGlobalTracking),
              // userPostActions
              ...formulateUserPostActionsTracking(userPostActions),
              // userPostTracking
              formulateUserPostLinkClickTracking(userPostTracking),
              // userPosts
              ...formulateUserPosts(userPosts),
              // userRegistrations, return only a string
              formulateRegistrations(userRegisterations)
            ];
            spreadsheetData.push(eachRow);
          }
          await setDownloadFileName(templateName + '.csv');
          await setAllUserResponses(spreadsheetData);
          // use ref to press start the downloading for CSV file
          csvLinkRef?.current.link.click();
        }
      } else dispatch(showInfoSnackbar("No Response Exist to download!"));
      dispatch(showInfoSnackbar("Download complete!"));
      await setIsLoading(false);
    } catch (error) {
      await setIsLoading(false);
      dispatch(showErrorSnackbar("Some error occured, Try again later!"));
    }
  };

  return (
    <Container component="main" maxWidth="lg" className={classes.card}>
    <h1>Data Download</h1>
    {isLoading && <Progress />}
    <div className={classes.form}>
        <Table aria-label="Template(s) with User(s) Information">
          <TableHead>
            <TableRow>
              <TableCell className={classes.body, classes.head} align="center"><p>{DATA_PAGE.CONDITION_NAME}</p></TableCell>
              <TableCell className={classes.body, classes.head} align="center"><p>{DATA_PAGE.RESPONSES}</p></TableCell>
              <TableCell className={classes.body, classes.head} align="center"><p>Download CSV</p></TableCell>
              <TableCell className={classes.body, classes.head} align="center"><p>Download JSON</p></TableCell>
              <TableCell className={classes.body, classes.head} align="center"><p>Download Media</p></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tempWithUsersCount?.length && tempWithUsersCount.map((row) => (
              <TableRow key={row.templateId}>
                <TableCell align="center">
                  <p>{row.templateName}</p>
                </TableCell>
                <TableCell align="center">
                  <p>{row.userEntries}</p>
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={e => downloadSpecificTemplate(row.templateId, row.templateName, 'CSV', e)}
                  >
                    <IconTableExport />
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                      onClick={e => downloadSpecificTemplate(row.templateId, row.templateName, 'JSON', e)}
                  >
                    <IconDatabaseExport />
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                      onClick={e => downloadTemplateMedia(row.templateId, row.templateName, e)}
                  >
                    <IconFileExport />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!tempWithUsersCount && <h5 style={{textAlign: 'center'}}>{DATA_PAGE.NO_RESPONSE_YET}</h5>}
        {/* {allowAllDataDownload !== null ? <CSVDownload data={allowAllDataDownload} target="_blank" /> : null} */}
        {/* {<CSVLink headers={headersMain} data={allUserResponses} filename={downloadFileName} ref={csvLinkRef}/>} */}
        {<CSVLink data={allUserResponses} filename={downloadFileName} ref={csvLinkRef}/>}
      </div>
    </Container>
  )
}

export default Template;