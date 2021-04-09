import { getUserInfoDetails } from '../../../../services/info-service';
import { useEffect, useState } from "react";
import { Button, TextField, Card, Link, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar } from '../../../../actions/snackbar';
import { updateUser } from '../../../../actions/user';
import MUIRichTextEditor from 'mui-rte';
import { updateFlowDisabledState } from '../../../../actions/flowState';

const InfoPage = ({ data }) => {

  const [richData, setRichData] = useState(null);
  const [consentRes, setConsentRes] = useState('');
  const { isLoggedInUser } = useSelector(state => state.userAuth);

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    const ret = await getUserInfoDetails(data._id);
    const obj = ret.data.data || null; // richText
    if (obj === null) {
      dispatch(showInfoSnackbar("You can proceed further!"));
      dispatch(updateFlowDisabledState()); // some othe error occured, let them go through for now
    }
    // if not a consent form then set the disabled property right now
    if (obj && !(obj.consent)) {
      // normal info page
      dispatch(updateFlowDisabledState());
    } 
    await setRichData(obj);
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    fetch();
  }, []);

  const handleChange = (e) => {
    setConsentRes(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (consentRes) {
      const data = {
        consent: consentRes === 'YES' ? true : false
      }
      dispatch(updateUser({ userObj: data }));
      dispatch(updateFlowDisabledState());
    } else dispatch(showErrorSnackbar('Please provide a valid response!'));
  };

  return (
   <>
   <Card className={classes.form}>
    {richData && richData.richText &&
      <MUIRichTextEditor
        readOnly={true}
        toolbar={false}
        defaultValue={richData.richText}
      />}
    </Card>

    {richData?.consent ?
    <form onSubmit={handleSubmit} className={classes.form}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Please provide your consent?</FormLabel>
      </FormControl>
      <RadioGroup aria-label="MCQ Questions" name="MCQ" value={consentRes} onChange={e => handleChange(e)}>
        <FormControlLabel value={'YES'} control={<Radio color="primary" />} label="Yes" />
        <FormControlLabel value={'NO'} control={<Radio color="primary" />} label="No" />
      </RadioGroup>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className={classes.submit}
      >
        Save
      </Button>
    </form>
    : null}
   </>
  );
};

export default InfoPage;
