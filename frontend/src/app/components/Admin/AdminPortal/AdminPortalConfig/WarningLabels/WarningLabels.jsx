import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Container,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@material-ui/core";
import SocialMediaPages from "../../../../Common/AdminCommon/SocialMediaPages";
import useStyles from "../../../../style";
import { getSocialMediaPosts, setSocialMediaLabels } from "../../../../../services/admin-userpost-service";
import { useSelector, useDispatch } from "react-redux";
import { IconDeviceFloppy } from "@tabler/icons-react";
import clsx from "clsx";
import RichTextArea from "../../../../Common/AdminCommon/RichTextArea";
import { WARNING_LABELS } from "../../../../../constants";
import TextFormatOutlinedIcon from "@material-ui/icons/TextFormatOutlined";
import { showErrorSnackbar, showSuccessSnackbar } from "../../../../../actions/snackbar";

const WarningLabels = () => {
  const [active, setActive] = useState("");
  const [currSelectedPost, setCurrSelectedPost] = useState([]);
  const classes = useStyles();
  const [richText, setRichText] = useState(null);
  const [clearRichText, setClearRichText] = useState(false);
  const { _id: templateId } = useSelector((state) => state.template);
  const [templateDialogBox, setTemplateDialogBox] = useState({
    open: false,
    postId: null,
  });
  const dispatch = useDispatch();
  const [currPostsData, setCurrPostsData] = useState({});

  const fetchCurrPagePosts = async () => {
    const { data } = await getSocialMediaPosts(templateId, active);
    await setCurrSelectedPost(data?.response || []);
    let postsData = {};
    if (data?.response) {
      for (let i = 0; i < data?.response?.length; ++i) {
        let item = data?.response[i];
        postsData[item._id] = {
          link: item.checkersLink || "",
          richText: item.labelRichText || "",
          label: item.warningLabel || ""
        };
      }
      await setCurrPostsData(postsData);
    }
  };

  useEffect(() => {
    // fetch previous posts
    if (active !== "") {
      fetchCurrPagePosts();
    }
  }, [active]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setSocialMediaLabels({ data: JSON.stringify(currPostsData) });
      await fetchCurrPagePosts();
      dispatch(showSuccessSnackbar("Warning Labels have been successfully updated!"));    
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

  const handleClickOpen = async (e, postId) => {
    e.preventDefault();
    await setRichText(currPostsData[postId]?.richText);
    await setTemplateDialogBox({ open: true, postId });
  };

  const handleClose = () => {
    setTemplateDialogBox({ open: false, postId: null });
  };

  const handleChange = async (e, postId, type) => {
    e.preventDefault();
    const newObj = {
      ...currPostsData,
      [postId]: {
        ...currPostsData[postId],
        [type]: type === 'richText' ? richText : e.target.value
      }
    };
    await setCurrPostsData(newObj);

    if (type === 'richText') {
      handleClose();
    }
  };

  const createMenuItems = () => {
    let menuItems = [];
    for (let item in WARNING_LABELS) {
      menuItems.push(<MenuItem value={item} key={item}>{item}</MenuItem>)
    }
    return menuItems;
  };

  return (
    <>
      <Container component="main" maxWidth="lg" className={classes.card}>
        <h1>Warning Labels Page</h1>
        <Box component="span" className={classes.note} display="block">
          <p>Please note that the warning labels will only appear on Facebook's 
            social media page, but other pages may be visible below.</p>
        </Box>
        <SocialMediaPages
          active={active}
          setActive={setActive}
          templateId={templateId}
        />
        <br />
        <br />
        <Table aria-label="Social Media Admin Posts">
          <TableHead>
            <TableRow>
              <TableCell
                className={`${classes.body}, ${classes.head}`}
                align="center"
              >
                <p>{"Post ID"}</p>
              </TableCell>
              <TableCell
                className={`${classes.body}, ${classes.head}`}
                align="center"
              >
                <p>{"Post Type"}</p>
              </TableCell>
              <TableCell
                className={`${classes.body}, ${classes.head}`}
                align="center"
              >
                <p>{"Label Type"}</p>
              </TableCell>
              <TableCell
                className={`${classes.body}, ${classes.head}`}
                align="center"
              >
                <p>{"Label Text"}</p>
              </TableCell>
              <TableCell
                className={`${classes.body}, ${classes.head}`}
                align="center"
              >
                <p>{"Checker Link"}</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(currPostsData).length > 0 && currSelectedPost.length > 0
              ? currSelectedPost.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell align="center">
                      <p>{row.adminPostId}</p>
                    </TableCell>
                    <TableCell align="center">
                      <p>{row.type}</p>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          {"Type"}
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={currPostsData[row._id]?.label || ""}
                          onChange={(e) => handleChange(e, row._id, 'label')}
                          label={"Warning Labels"}
                        >
                          {createMenuItems()}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        aria-label="Label Text"
                        onClick={(e) => handleClickOpen(e, row._id)}
                      >
                        <TextFormatOutlinedIcon />
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        id="checkersLink"
                        value={currPostsData[row._id]?.link || ""}
                        onChange={(e) => handleChange(e, row._id, 'link')}
                        type="text"
                      />
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          startIcon={<IconDeviceFloppy />}
          className={clsx(classes.submit, classes.widthFitContent)}
        >
          SAVE
        </Button>
      </Container>

      <Dialog
        open={templateDialogBox.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {"Personalize the text formatting for the label"}
        </DialogTitle>
        <DialogContent>
          <RichTextArea
            setRichText={setRichText}
            defaultValue={richText}
            clearRichText={clearRichText}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Discard
          </Button>
          <Button
            onClick={(e) => handleChange(e, templateDialogBox.postId, 'richText')}
            color="primary"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WarningLabels;
