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
import { getAdminTemplatesWithUserCount, fetchTemplateData } from '../../../../../services/metrics-service';
import { IconTableExport, IconDatabaseExport } from '@tabler/icons';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
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
  formulateHeaders
} from './metrics-helper';

const Template = () => {
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const [tempWithUsersCount, setTempWithUsersCount] = useState(null);
  // const [headers, setHeaders] = useState([]);
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
  
  const downloadSpecificTemplate = async (templateId, templateName, type, e) => {
    e.preventDefault();
    try {
      await setIsLoading(true);
      const { data } = await fetchTemplateData(templateId);
      // this is JSON for all user data
      const allUserData = data?.allUserData || [];
      const socialMediaPageData = data?.socialMediaPageData || null;
      const templateAdminPortalQuestionsData = data?.templateAdminPortalQuestionsData || null;
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
              ...formulateUserPosts(userPosts)
            ];
            spreadsheetData.push(eachRow);
          }
      
          await setDownloadFileName(templateName + '.csv');
          await setAllUserResponses(spreadsheetData);
          // use ref to press start the downloading for CSV file
          csvLinkRef?.current.link.click();
        }
      } else dispatch(showInfoSnackbar("No Response Exist to download!"));
      await setIsLoading(false);
    } catch (error) {
      await setIsLoading(false);
      dispatch(showErrorSnackbar("Some error occured, Try again later!"));
    }
  };

  return (
    <Container component="main" maxWidth="lg" className={classes.card}>
    <h1>Data Page</h1>
    {isLoading && <Progress />}
    <div className={classes.form}>
        <Table aria-label="Template(s) with User(s) Information">
          <TableHead>
            <TableRow>
              <TableCell className={classes.body, classes.head} align="center"><p>{DATA_PAGE.CONDITION_NAME}</p></TableCell>
              <TableCell className={classes.body, classes.head} align="center"><p>{DATA_PAGE.RESPONSES}</p></TableCell>
              <TableCell className={classes.body, classes.head} align="center"><p>Download CSV</p></TableCell>
              <TableCell className={classes.body, classes.head} align="center"><p>Download JSON</p></TableCell>
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
                    <IconDatabaseExport />
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                      onClick={e => downloadSpecificTemplate(row.templateId, row.templateName, 'JSON', e)}
                  >
                    <IconTableExport />
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