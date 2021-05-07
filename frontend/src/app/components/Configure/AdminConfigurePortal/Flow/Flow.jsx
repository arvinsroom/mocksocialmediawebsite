import { Button,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { update, get } from '../../../../services/page-service';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../actions/snackbar';
import { TEMPLATE, FLOW_PAGE } from '../../../../constants';

const Flow = () => {
  const [pages, setPages] = useState("");
  const [pageOrderData, setPageOrderData] = useState(null);
  const dispatch = useDispatch();

  const { isLoggedInAdmin } = useSelector(state => state.auth);
  const classes = useStyles();
  const { _id: templateId } = useSelector(state => state.template);

  const fetchAllPages = async () => {
    const { data } = await get(templateId);
    await setPages(data);
  }

  useEffect(() => {
    fetchAllPages();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!templateId) {
      dispatch(showInfoSnackbar(TEMPLATE.SELECT_OR_CREATE_TEMPLATE));
    }
    try {
      await update({ pageObj: pageOrderData });
      await setPageOrderData(null);
      await fetchAllPages();
      dispatch(showSuccessSnackbar(FLOW_PAGE.FLOW_PAGE_SUCCESS));    
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch(showErrorSnackbar(resMessage));
    }
  };

  const handleChange = async (pageId, e) => {
    e.preventDefault();

    const newObj = {
      ...pageOrderData,
      [pageId]: e.target.value
    };
    await setPageOrderData(newObj);
  };

  if (!isLoggedInAdmin) {
    return <Redirect to="/admin" />;
  }

  return (
    <Container component="main" maxWidth="lg" className={classes.card}>
    <Box component="span" className={classes.note} display="block">
      {FLOW_PAGE.FLOW_CONFIG_NOTE}
    </Box>
    <form onSubmit={handleSubmit} className={classes.form}>
      <Table aria-label="Configure Page Ordering">
      <TableHead>
        <TableRow>
          <TableCell className={classes.body, classes.head} align="center">{FLOW_PAGE.PAGE_NAME}</TableCell>
          <TableCell className={classes.body, classes.head} align="center">{FLOW_PAGE.PAGE_TYPE}</TableCell>
          <TableCell className={classes.body, classes.head} align="center">{FLOW_PAGE.SET_FLOW_ORDER}</TableCell>
          <TableCell className={classes.body, classes.head} align="center">{FLOW_PAGE.CURRENT_FLOW_ORDER}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pages && pages.length > 0 ? pages.map((row) => (
          <TableRow key={row._id}>
            <TableCell align="center">{row.name}</TableCell>
            <TableCell align="center">{row.type}</TableCell>
            <TableCell align="center">
              <TextField
                id="standard-number"
                onChange={e => handleChange(row._id, e)}
                inputProps={{ min: 0, max: 65535, step: 1 }}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </TableCell>
            <TableCell align="center">
              <TextField
                id="standard-number"
                disabled={true}
                // InputProps={{ inputProps: { min: 0, max: 65535 } }}
                value={row.flowOrder || 0}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </TableCell>
          </TableRow>
        )) : null}
      </TableBody>
    </Table>
    <Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      disabled={!pageOrderData}
      className={classes.submit}
    >
      Save
    </Button>
    </form>
    </Container>
  );
};

export default Flow;