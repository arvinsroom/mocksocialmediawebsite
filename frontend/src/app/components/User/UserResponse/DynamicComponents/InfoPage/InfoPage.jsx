import { getUserInfoDetails } from '../../../../../services/info-service';
import { getFacebookFakeActionPosts } from '../../../../../services/facebook-service';
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
import useStyles from '../../../../style';
import { showSuccessSnackbar, showInfoSnackbar, showErrorSnackbar } from '../../../../../actions/snackbar';
import { updateUserMain } from '../../../../../actions/user';
import { updateFlowActiveState } from '../../../../../actions/flowState';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Progress from '../../../../Common/Progress';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../../constants';
import RenderRichTextArea from '../../../../Common/UserCommon/RenderRichTextArea';
import './InfoPage.css';

const InfoPage = ({ data }) => {
  const [infoDetails, setInfoDetails] = useState(null);
  const [consentRes, setConsentRes] = useState('');
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);
  const [isLoading, setIsLoading] = useState(false);

  const [fakeActionSocialMediaPosts, setFakeActionSocialMediaPosts] = useState([]);
  const [fakeShareSocialMediaPosts, setFakeShareSocialMediaPosts] = useState([]);
  
  const dispatch = useDispatch();
  const classes = useStyles();

  const fetchInfoDetails = async () => {
    try {
      const ret = await getUserInfoDetails(data._id);
      const obj = ret.data.infoDetails || null;
      
      // dispatch finish response event
      if (obj.isFinish) {
        const utcDateTime = new Date();
        var utcDateTimeString = utcDateTime.toISOString().replace('Z', '').replace('T', ' ');
        await dispatch(updateUserMain({ finishedAt: utcDateTimeString }));
      }

      if (obj?.socialMediaPageId !== null) {
        const { data: response } = await getFacebookFakeActionPosts(obj.socialMediaPageId);
        setFakeActionSocialMediaPosts(response?.actionPostsData || []);
        setFakeShareSocialMediaPosts(response?.sharePostsData || []); 
      }
      await setInfoDetails(obj);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch(showErrorSnackbar((translations?.error) || USER_TRANSLATIONS_DEFAULT.ERROR));
    }
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    setIsLoading(true);
    fetchInfoDetails();
  }, []);

  const handleConsentChange = (e) => {
    setConsentRes(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const requestConsentRes = infoDetails?.consent || false;
      if (!requestConsentRes) dispatch(updateFlowActiveState());
      else if (requestConsentRes && consentRes) {
        dispatch(updateUserMain({ consent: consentRes === 'YES' ? true : false }));
        dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
        dispatch(updateFlowActiveState());
      } else dispatch(showInfoSnackbar((translations?.['please_answer_all_required_questions_to_continue.']) || USER_TRANSLATIONS_DEFAULT.ENTER_REQUIRED_INFO));
    } catch (error) {
      dispatch(showErrorSnackbar((translations?.error) || USER_TRANSLATIONS_DEFAULT.ERROR));
    }
  };

  const capitalize = (str) => {
    if (typeof str !== 'string' || str === '') return '';
    const lowerCase = str.slice(1).toLowerCase();
    return str.charAt(0).toUpperCase() + lowerCase;
  }

  return (  
   <>
    <Container component="main" maxWidth="md" className={classes.card}>

      {data?.richText && <RenderRichTextArea richText={data.richText} />}

      {infoDetails?.consent === true &&
        <Container component="main" maxWidth="md" className={classes.card}>
          <FormControl component="fieldset">
            <FormLabel component="legend">{(translations?.['please_indicate_whether_you_consent_to_participate_to_continue.']) || USER_TRANSLATIONS_DEFAULT.PROVIDE_CONSENT}</FormLabel>
          </FormControl>
          <RadioGroup aria-label="MCQ Questions" name="MCQ" value={consentRes} onChange={e => handleConsentChange(e)}>
            <FormControlLabel value={'YES'} control={<Radio color="primary" />} label={(translations?.i_consent) || USER_TRANSLATIONS_DEFAULT.I_CONSENT} />
            <FormControlLabel value={'NO'} control={<Radio color="primary" />} label={(translations?.i_do_not_consent) || USER_TRANSLATIONS_DEFAULT.I_DO_NOT_CONSENT} />
          </RadioGroup>
        </Container>}
      {infoDetails?.socialMediaPageId !== null &&
        <Container component="main" maxWidth="md" className={classes.card}>
          {fakeShareSocialMediaPosts?.length > 0 ? 
            <>
            <p><b>Shared posts</b></p>
            {fakeShareSocialMediaPosts.map(item => (
              <div key={item._id} className={classes.card}>
                <div className="fakePostDetails">
                  <p>Post message: {item.postMessage || ""}</p>
                </div>
              </div>
            ))}
            </>
          : 
            <p>No shared posts!</p>
          }
          {fakeActionSocialMediaPosts?.length > 0 ? 
          <>
            <p><b>Liked or commented posts</b></p>
            {fakeActionSocialMediaPosts.map(item => (
              <div key={item._id} className={classes.card}>
                <div className="fakePostDetails">
                  <p>Action: {capitalize(item.action)}</p>
                  {item.action === 'COMMENT' && <p>Comment: {item.comment || ""}</p>}
                  <p>Post message: {item.userPosts.postMessage || ""}</p>
                </div>
              </div>
            ))}
            </>
          : 
            <p>No liked or commented posts!</p>
          }
        </Container>
      }
      {isLoading && <Progress />}

      {infoDetails?.isFinish !== true &&
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ float: 'right', width: '25%'}}
          onClick={handleSubmit}
          className={classes.submit}
        >
          <ArrowForwardIosIcon style={{ fontSize: 15 }} />
        </Button>
      }
    </Container>
   </>
  );
};

export default InfoPage;
