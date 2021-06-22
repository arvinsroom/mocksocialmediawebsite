import { Button,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { update, get, deletePage } from '../../../../../services/page-service';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../../style';
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../../actions/snackbar';
import { TEMPLATE, FLOW_PAGE } from '../../../../../constants';
import { IconRefresh, IconTrash } from '@tabler/icons';
import clsx from 'clsx';

const Flow = () => {
  const [pages, setPages] = useState("");
  const [pageOrderData, setPageOrderData] = useState(null);
  const dispatch = useDispatch();
  const [flowDialogBox, setFlowDialogBox] = useState({
    open: false,
    pageId: null,
    name: ""
  });

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

  const handleClickOpen = (pageId, name, e) => {
    e.preventDefault();
    setFlowDialogBox({ open: true, pageId: pageId, name: name });
  };

  const handleClose = () => {
    setFlowDialogBox({ open: false, pageId: null, name: "" });
  };

  const removePage = async () => {
    if (flowDialogBox.pageId) {
      await deletePage(flowDialogBox.pageId);
      handleClose();
      await fetchAllPages();
    }
  };
  return (
    <>
    <Container component="main" maxWidth="lg" className={classes.card}>
    <h1>Study Flow</h1>
    <Box component="span" className={classes.note} display="block">
      {FLOW_PAGE.FLOW_CONFIG_NOTE}
    </Box>

    <Table aria-label="Configure Page Ordering">
      <TableHead>
        <TableRow>
          <TableCell className={classes.body, classes.head} align="center"><p>{FLOW_PAGE.PAGE_NAME}</p></TableCell>
          <TableCell className={classes.body, classes.head} align="center"><p>{FLOW_PAGE.PAGE_TYPE}</p></TableCell>
          <TableCell className={classes.body, classes.head} align="center"><p>{FLOW_PAGE.CURRENT_FLOW_ORDER}</p></TableCell>
          <TableCell className={classes.body, classes.head} align="center"><p>{FLOW_PAGE.SET_FLOW_ORDER}</p></TableCell>
          <TableCell className={classes.body, classes.head} align="center"><p>Delete Page</p></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pages && pages.length > 0 ? pages.map((row) => (
          <TableRow key={row._id}>
            <TableCell align="center">
              <p>{row.name}</p>
            </TableCell>
            <TableCell align="center">
              <p>{row.type}</p>
            </TableCell>
            <TableCell align="center">
              <p>{row.flowOrder || 0}</p>
            </TableCell>
            <TableCell align="center">
              <TextField
                id="standard-number"
                onChange={e => handleChange(row._id, e)}
                inputProps={{ min: 0, max: 65535, step: 1 }}
                type="number"
              />
            </TableCell>
            <TableCell align="center">
              <Button
                aria-label="delete template"
                onClick={(e) => handleClickOpen(row._id, row.name, e)}
                >
                <IconTrash />
              </Button>
            </TableCell>
          </TableRow>
        )) : null}
      </TableBody>
    </Table>
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={!pageOrderData}
      className={classes.submit}
      onClick={handleSubmit}
      component="label"
      startIcon={<IconRefresh />}
      className={clsx(classes.submit, classes.widthFitContent)}
    >
      UPDATE FLOW ORDER
    </Button>

    </Container>
        <Dialog
        open={flowDialogBox.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{"Are you sure you want to delete this Page?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting this Page will also delete all the responses attached to this Page.
            <br></br><br></br>
            <b>Page being deleted: {flowDialogBox.name}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            No
          </Button>
          <Button onClick={removePage} color="primary" >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
};

export default Flow;