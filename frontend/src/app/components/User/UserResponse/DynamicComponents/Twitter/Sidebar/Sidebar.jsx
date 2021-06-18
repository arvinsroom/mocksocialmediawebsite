import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import TweetBox from "../Feed/TweetBox";
import "./Sidebar.css";

const Sidebar = () => {
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

      <SidebarOption active Icon={HomeIcon} text="Home" />
      <SidebarOption Icon={SearchIcon} text="Explore" />
      <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" />
      <SidebarOption Icon={MailOutlineIcon} text="Messages" />
      <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" />
      <SidebarOption Icon={ListAltIcon} text="Lists" />
      <SidebarOption Icon={PermIdentityIcon} text="Profile" />
      <SidebarOption Icon={MoreHorizIcon} text="More" />

      <Button
        variant="outlined"
        className="sidebarTweet"
        onClick={openModal}
      >
        Tweet
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
                <TweetBox placeholderText={"What's happening?"} replyTo={null} quoteTweet={null} handleCloseModal={handleCloseModal} />
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
