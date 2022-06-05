import { useState } from "react";
import { useSelector } from "react-redux";
import TwitterIcon from "@material-ui/icons/Twitter";
import SidebarOption from "./SidebarOption/SidebarOption";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import ClearIcon from '@material-ui/icons/Clear';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button, Modal, Container } from '@material-ui/core';
import TweetBox from '../Feed/TweetBox/TweetBox';
import { TW_TRANSLATIONS_DEFAULT } from '../../../../../../constants';
import "./Sidebar.css";

const Sidebar = () => {
  const socialMediaTranslations = useSelector(state => state.socialMedia.socialMediaTranslations);
  const [modalOpen , setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleCloseModal = () => {
    setModalOpen(false)
  };
  return (
    <>
    <div className="twitterSidebar">
      <TwitterIcon className="twitterSidebarIcon"/>

      <SidebarOption active Icon={HomeIcon} text={socialMediaTranslations?.home || TW_TRANSLATIONS_DEFAULT.HOME} />
      <SidebarOption Icon={SearchIcon} text={socialMediaTranslations?.explore || TW_TRANSLATIONS_DEFAULT.EXPLORE} />
      <SidebarOption Icon={NotificationsNoneIcon} text={socialMediaTranslations?.notifications || TW_TRANSLATIONS_DEFAULT.NOTIFICATIONS} />
      <SidebarOption Icon={MailOutlineIcon} text={socialMediaTranslations?.messages || TW_TRANSLATIONS_DEFAULT.MESSAGES} />
      <SidebarOption Icon={BookmarkBorderIcon} text={socialMediaTranslations?.bookmarks || TW_TRANSLATIONS_DEFAULT.BOOKMARKS} />
      <SidebarOption Icon={ListAltIcon} text={socialMediaTranslations?.lists || TW_TRANSLATIONS_DEFAULT.LISTS} />
      <SidebarOption Icon={PermIdentityIcon} text={socialMediaTranslations?.profile || TW_TRANSLATIONS_DEFAULT.PROFILE} />
      <SidebarOption Icon={MoreHorizIcon} text={socialMediaTranslations?.more || TW_TRANSLATIONS_DEFAULT.MORE} />

      <Button
        variant="outlined"
        className="sidebarTweet"
        onClick={openModal}
      >
        {socialMediaTranslations?.tweet || TW_TRANSLATIONS_DEFAULT.TWEET}
      </Button>
    </div>
    {modalOpen && 
      <Modal
        open={true}
        disableAutoFocus={true}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {
          <Container component="main" className="modalContainer" maxWidth="sm">
            <div className="modalContainerPaper">
              <div className="modalTop">
                <div className="modalTopBtn">
                  <ClearIcon className="btn" onClick={handleCloseModal} />
                </div>
              </div>
              <div key={"sidebar"} >
                <TweetBox 
                  placeholderText={socialMediaTranslations?.["what's_happening?"] || TW_TRANSLATIONS_DEFAULT.WHATS_HAPPENING}
                  replyTo={null}
                  quoteTweet={null}
                  handleCloseModal={handleCloseModal} />
              </div>
            </div>
          </Container>
        }
      </Modal>
    }
    </>
  );
};

export default Sidebar;
