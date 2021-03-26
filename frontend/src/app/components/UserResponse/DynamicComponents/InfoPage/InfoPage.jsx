import { getUserInfoDetails } from '../../../../services/info-service';
import { useEffect, useState } from "react";
import { Button, TextField, Card, Link } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import MUIRichTextEditor from 'mui-rte';

const InfoPage = ({ data }) => {

  const [richData, setRichData] = useState(null);

  const dispatch = useDispatch();
  const classes = useStyles();
  
  const fetch = async () => {
    const ret = await getUserInfoDetails(data._id);
    const obj = ret.data.data || null;// richText

    await setRichData(obj);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
   <>
   <Card className={classes.rootText}>
    {richData && richData.richText &&
      <MUIRichTextEditor
        readOnly={true}
        toolbar={false}
        defaultValue={richData.richText}
      />}
    </Card>
   </>
  );
};

export default InfoPage;