import { useState } from "react";
import { useSelector } from "react-redux";
import SidebarOption from "./SidebarOption/SidebarOption";
import SidebarHome from '../../../../../../../assets/Twitter/sidebar-home.svg';
import SidebarExplore from '../../../../../../../assets/Twitter/sidebar-explore.svg';
import SidebarNotifications from '../../../../../../../assets/Twitter/sidebar-notifications.svg';
import SidebarMessages from '../../../../../../../assets/Twitter/sidebar-messages.svg';
import SidebarBookmarks from '../../../../../../../assets/Twitter/sidebar-bookmarks.svg';
import SidebarLists from '../../../../../../../assets/Twitter/sidebar-lists.svg';
import SidebarProfile from '../../../../../../../assets/Twitter/sidebar-profile.svg';
import SidebarMore from '../../../../../../../assets/Twitter/sidebar-more.svg';
import ClearIcon from '@material-ui/icons/Clear';
import { Modal, Container } from '@material-ui/core';
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
      <SidebarOption Icon={SidebarHome} active={true} text={socialMediaTranslations?.home || TW_TRANSLATIONS_DEFAULT.HOME} />
      <SidebarOption Icon={SidebarExplore} text={socialMediaTranslations?.explore || TW_TRANSLATIONS_DEFAULT.EXPLORE} />
      <SidebarOption Icon={SidebarNotifications} text={socialMediaTranslations?.notifications || TW_TRANSLATIONS_DEFAULT.NOTIFICATIONS} />
      <SidebarOption Icon={SidebarMessages} text={socialMediaTranslations?.messages || TW_TRANSLATIONS_DEFAULT.MESSAGES} />
      <SidebarOption Icon={SidebarBookmarks} text={socialMediaTranslations?.bookmarks || TW_TRANSLATIONS_DEFAULT.BOOKMARKS} />
      <SidebarOption Icon={SidebarLists} text={socialMediaTranslations?.lists || TW_TRANSLATIONS_DEFAULT.LISTS} />
      <SidebarOption Icon={SidebarProfile} text={socialMediaTranslations?.profile || TW_TRANSLATIONS_DEFAULT.PROFILE} />
      <SidebarOption Icon={SidebarMore} text={socialMediaTranslations?.more || TW_TRANSLATIONS_DEFAULT.MORE} />

      <button
        variant="outlined"
        className="sidebarTweet"
        onClick={openModal}
      >
        {socialMediaTranslations?.tweet || TW_TRANSLATIONS_DEFAULT.TWEET}
      </button>
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
