import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Tooltip,
  Fab,
  Container
} from '@material-ui/core';
import { useEffect, useState, useRef } from 'react';
import { getAdminTemplatesWithUserCount, fetchTemplateData } from '../../../../../services/metrics-service';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../../style';
import { showErrorSnackbar, showInfoSnackbar } from '../../../../../actions/snackbar';
import { CSVDownload, CSVLink } from "react-csv";
import { DATA_PAGE } from '../../../../../constants';
import Progress from '../../../../Common/Progress';

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
      // console.log('getAdminTemplatesWithUserCount: ', data);
      console.log(data);
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
      const responses = data?.response || [];
      const CSVResponses = data?.CSVResponses || [];
      // set the response as it it
      if (responses.length > 0) {
        if (type === 'JSON') {
          const json = JSON.stringify(responses);
          const blob = new Blob([json],{ type:'application/json' });
          const href = await URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = href;
          link.download = templateName.toString() + ".json";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (type === 'CSV') {
          await setDownloadFileName(templateName + '.csv');
          await setAllUserResponses(CSVResponses);
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
    <div className={classes.form}>
      <Box component="span" className={classes.note} display="block">
        {DATA_PAGE.DATA_PAGE_NOTE}
      </Box>
        <Table aria-label="Template(s) with User(s) Information">
          <TableHead>
            <TableRow>
              <TableCell className={classes.body, classes.head} align="center">{DATA_PAGE.CONDITION_NAME}</TableCell>
              <TableCell className={classes.body, classes.head} align="center">{DATA_PAGE.RESPONSES}</TableCell>
              <TableCell className={classes.body, classes.head} align="center">Download (CSV/JSON)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tempWithUsersCount?.length && tempWithUsersCount.map((row) => (
              <TableRow key={row.templateId}>
                <TableCell align="center">{row.templateName}</TableCell>
                <TableCell align="center">{row.userEntries}</TableCell>
                <TableCell align="center">
                  {isLoading ? <Progress /> :
                    <>
                      <Tooltip title="Download CSV data" aria-label="Download CSV data" >
                        <IconButton aria-label="Download this template data" onClick={e => downloadSpecificTemplate(row.templateId, row.templateName, 'CSV', e)}>
                          <GetAppIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download JSON data" aria-label="Download JSON data" >
                        <IconButton aria-label="Download this template data" onClick={e => downloadSpecificTemplate(row.templateId, row.templateName, 'JSON', e)}>
                          <SystemUpdateIcon color="primary"/>
                        </IconButton>
                      </Tooltip>
                    </>
                  }
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