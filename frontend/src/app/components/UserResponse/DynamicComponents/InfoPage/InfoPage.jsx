import { getUserInfoDetails } from '../../../../services/info-service';
import { getFacebookFakeActionPosts } from '../../../../services/facebook-service';
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Container
 } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showSuccessSnackbar, showInfoSnackbar } from '../../../../actions/snackbar';
import { updateUser } from '../../../../actions/user';
import MUIRichTextEditor from 'mui-rte';
import { EditorState, convertToRaw } from 'draft-js'
import { updateFlowActiveState } from '../../../../actions/flowState';
import _ from 'lodash';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './InfoPage.css';
import Progress from '../../../Progress';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../constants';

const InfoPage = ({ data }) => {
  const [infoDetails, setInfoDetails] = useState(null);
  const [renderRichText, setRenderRichText] = useState(false);  
  const [consentRes, setConsentRes] = useState('');
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);
  const [isLoading, setIsLoading] = useState(false);

  const [fakeActionSocialMediaPosts, setFakeActionSocialMediaPosts] = useState([]);
  const [fakeShareSocialMediaPosts, setFakeShareSocialMediaPosts] = useState([]);
  
  const dispatch = useDispatch();
  const classes = useStyles();

  const fetchInfoDetails = async () => {
    const ret = await getUserInfoDetails(data._id);
    const obj = ret.data.infoDetails || null; // richText
    if (obj) {
      if (obj?.richText) {
        const parsedRichTextObject = JSON.parse(obj.richText);
        const parsedEmptyObject = convertToRaw(EditorState.createEmpty().getCurrentContent());
        // delete key properties from both and then compare these objects
        delete parsedRichTextObject.blocks[0].key;
        delete parsedEmptyObject.blocks[0].key;
        setRenderRichText(!_.isEqual(parsedEmptyObject, parsedRichTextObject));
      }
      if (obj?.socialMediaPageId !== null) {
        const { data } = await getFacebookFakeActionPosts(obj.socialMediaPageId);
        setFakeActionSocialMediaPosts(data?.actionPostsData || []);
        setFakeShareSocialMediaPosts(data?.sharePostsData || []); 
      }
      await setInfoDetails(obj);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    setIsLoading(true);
    fetchInfoDetails();
  }, []);

  const handleChange = (e) => {
    setConsentRes(e.target.value);
  };

  const handleClick = async e => {
    e.preventDefault();
    const requestConsentRes = infoDetails?.consent || false;
    if (!requestConsentRes) dispatch(updateFlowActiveState());
    else if (requestConsentRes && consentRes) {
      const data = {
        consent: consentRes === 'YES' ? true : false
      }
      dispatch(updateUser({ userObj: data }));
      dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
      dispatch(updateFlowActiveState());
    } else dispatch(showInfoSnackbar((translations?.['please_answer_all_required_questions_to_continue.']) || USER_TRANSLATIONS_DEFAULT.ENTER_REQUIRED_INFO));
  };

  const capitalize = (str) => {
    if (typeof str !== 'string' || str === '') return '';
    const lowerCase = str.slice(1).toLowerCase();
    return str.charAt(0).toUpperCase() + lowerCase;
  }

  const dateString = (dateStr) => {
    if (typeof dateStr !== 'string' || dateStr === '') return '';
    const date = new Date(dateStr);
    return date.toLocaleString();
  }

  const checkPostType = (type) => {
    if (typeof type !== 'string' || type === '') return '';
    if (type !== 'SHARE') type = 'NEW';
    return capitalize(type);
  }

  return (  
   <>
    <Container component="main" maxWidth="md" className={classes.card}>
      {infoDetails?.richText && renderRichText &&
        <Container component="main" maxWidth="md" className={classes.card}>
          <MUIRichTextEditor
              readOnly={true}
              toolbar={false}
              defaultValue={infoDetails.richText}
            />
        </Container>}
      {infoDetails?.consent === true &&
      <Container component="main" maxWidth="md" className={classes.card}>
        <FormControl component="fieldset">
          <FormLabel component="legend">{(translations?.please_indicate_whether_you_consent_to_participate_to_continue) || USER_TRANSLATIONS_DEFAULT.PROVIDE_CONSENT}</FormLabel>
        </FormControl>
        <RadioGroup aria-label="MCQ Questions" name="MCQ" value={consentRes} onChange={e => handleChange(e)}>
          <FormControlLabel value={'YES'} control={<Radio color="primary" />} label={(translations?.i_consent) || USER_TRANSLATIONS_DEFAULT.I_CONSENT} />
          <FormControlLabel value={'NO'} control={<Radio color="primary" />} label={(translations?.i_do_not_consent) || USER_TRANSLATIONS_DEFAULT.I_DO_NOT_CONSENT} />
        </RadioGroup>
      </Container>}
      {infoDetails?.socialMediaPageId !== null &&
        <Container component="main" maxWidth="md" className={classes.card}>
          {fakeShareSocialMediaPosts?.length > 0 ? 
            <>
            <p><b>Shared or New Posts</b></p>
            {fakeShareSocialMediaPosts.map(item => (
              <div key={item._id} className={classes.card}>
                <div className="fakePostDetails">
                  <p>Type: {checkPostType(item.type) + ' Post'}</p>
                  <p>Post message: {item.postMessage || ""}</p>
                  <p>Created At: {dateString(item.createdAt)}</p>
                </div>
              </div>
            ))}
            </>
          : 
            <p>No Shared or New Posts!</p>
          }
          {fakeActionSocialMediaPosts?.length > 0 ? 
          <>
            <p><b>Liked or Commented Posts</b></p>
            {fakeActionSocialMediaPosts.map(item => (
              <div key={item._id} className={classes.card}>
                <div className="fakePostDetails">
                <p>Action: {capitalize(item.action)}</p>
                {item.action === 'COMMENT' && <p>Comment: {item.comment || ""}</p>}
                <p>Post Message: {item.userPosts.postMessage || ""}</p>
                <p>Created At: {dateString(item.createdAt)}</p>
                </div>
              </div>
            ))}
            </>
          : 
            <p>No Liked or Commented Posts!</p>
          }
        </Container>
      }
      {isLoading && <Progress />}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ float: 'right', width: '25%'}}
        onClick={handleClick}
        className={classes.submit}
      >
        <ArrowForwardIosIcon style={{ fontSize: 15 }} />
      </Button>
    </Container>
   </>
  );
};

export default InfoPage;
