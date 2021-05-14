import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import useStyles from './style';
import { getSocialMediaPages } from '../services/page-service';
import { INFO_PAGE } from '../constants';

export default function SocialMediaPages({ setActive, active, templateId }) {
  const [socialMediaPages, setSocialMediaPages] = useState(null);
  const [focused, setFocused] = useState(false)
  const classes = useStyles();

  const fetchSocialMediaPages = async () => {
    const { data } = await getSocialMediaPages(templateId);
    setSocialMediaPages(data.data);
  };

  useEffect(() => {
    if (focused) fetchSocialMediaPages();
  }, [focused]);

  const handleSocialMediaPage = async (e) => {
    setActive(e.target.value);
  };

  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="demo-simple-select-outlined-label">{INFO_PAGE.SELECT_SOCIAL_MEDIA_PAGE}</InputLabel>
      <Select
        onFocus={onFocus}
        onBlur={onBlur}
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={active}
        onChange={handleSocialMediaPage}
        label={INFO_PAGE.SELECT_SOCIAL_MEDIA_PAGE}
      >
        {socialMediaPages?.length > 0 ? socialMediaPages.map(page => (
          <MenuItem key={page._id} value={page._id}>{page.name}</MenuItem>
        )) : null}
      </Select>
    </FormControl>
  );
}
