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
import { useEffect, useState } from 'react';
import { getAdminTemplatesWithUserCount, fetchTemplateData } from '../../../../services/metrics-service';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showInfoSnackbar } from '../../../../actions/snackbar';
import { CSVDownload } from "react-csv";
import { DATA_PAGE } from '../../../../constants';

const Template = () => {
  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const [tempWithUsersCount, setTempWithUsersCount] = useState(null);
  const [allowAllDataDownload, setAllowAllDataDownload] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();

  const fetch = async () => {
    try {
      const { data } = await getAdminTemplatesWithUserCount();
      // we have data.data, data.userPosts, data.adminPosts
      // console.log('getAdminTemplatesWithUserCount: ', data);
      const res = data?.response || null;
      setTempWithUsersCount(res);
    } catch (error) {
      dispatch(showErrorSnackbar("Some error occured while fetching template and user information. Please Refresh the page!"))
    }
  }

  useEffect(() => {
    fetch();
  }, []);


  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }

  const downloadSpecificTemplate = async (templateId, e) => {
    e.preventDefault();
    const { data } = await fetchTemplateData(templateId);
    if (data) setAllowAllDataDownload(data);
    else setAllowAllDataDownload(null);
  };

  const downloadAllTemplateData = async (e) => {
    e.preventDefault();
    const { data } = await fetchTemplateData();
    if (data) setAllowAllDataDownload(data);
    else setAllowAllDataDownload(null);
  }

  return (
    <Container component="main" maxWidth="lg" className={classes.card}>
    <div className={classes.form}>
      <Box component="span" className={classes.note} display="block">
        {DATA_PAGE.DATA_PAGE_NOTE}
      </Box>
      <Tooltip title="Download All templates with all their user data." aria-label="Add Page">
        <Fab color="default" onClick={downloadAllTemplateData} className={classes.marginTenPx}>
          <GetAppIcon />
        </Fab>
      </Tooltip>


        <Table aria-label="Template(s) with User(s) Information">
          <TableHead>
            <TableRow>
              <TableCell className={classes.body, classes.head} align="center">{DATA_PAGE.CONDITION_NAME}</TableCell>
              <TableCell className={classes.body, classes.head} align="center">{DATA_PAGE.RESPONSES}</TableCell>
              <TableCell className={classes.body, classes.head} align="center">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tempWithUsersCount?.length && tempWithUsersCount.map((row) => (
              <TableRow key={row.templateId}>
                <TableCell align="center">{row.templateName}</TableCell>
                <TableCell align="center">{row.userEntries}</TableCell>
                <TableCell align="center">
                  <IconButton aria-label="Download this template data" onClick={e => downloadSpecificTemplate(row.templateId, e)}>
                    <GetAppIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!tempWithUsersCount && <h5 style={{textAlign: 'center'}}>{DATA_PAGE.NO_RESPONSE_YET}</h5>}
        {allowAllDataDownload !== null ? <CSVDownload data={allowAllDataDownload} target="_blank" /> : null}
      </div>
    </Container>
  )
}

export default Template;