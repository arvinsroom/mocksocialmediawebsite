import { getUserFinishDetails } from '../../../../../services/finish-service';
import { useEffect, useState } from "react";
import { Button, Link } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../../style';
import "./Finish.css";
import { updateFlowActiveState } from '../../../../../actions/flowState';
import { IconChevronRight } from '@tabler/icons';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../../constants';

const Finish = ({ data }) => {
  const [finishObj, setFinishObj] = useState(null);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);

  const fetch = async () => {
    const ret = await getUserFinishDetails(data._id);
    const obj = ret.data.data || null;// redirection Link and text to render

    await setFinishObj(obj);
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    fetch();
  }, []);

  const getRedirectionLink = (link) => {
    if (!link) return;
    return link.startsWith("http://") || link.startsWith("https://") ?
      link : `https://${link}`
  };

  const handleSubmit = () => {
    dispatch(updateFlowActiveState());
  };

  return (
   <>
      {finishObj ? 
        <>
          <p className='finishText'>{finishObj.text ? finishObj.text : ""}</p>
          {finishObj.redirectionLink &&
          <div className='finishLink'>
            <Link href={getRedirectionLink(finishObj.redirectionLink)} rel="noopener noreferrer" target="_blank">
              {translations?.click_here_to_continue_to_the_next_part_of_this_study || USER_TRANSLATIONS_DEFAULT.CLICK_TO_CONTINUE_STUDY}
            </Link>
          </div>
          }
        </>
      : null}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className={classes.submit}
        endIcon={<IconChevronRight />}
      >
        {translations?.next || "NEXT"}
      </Button>
    </>
  );
};

export default Finish;