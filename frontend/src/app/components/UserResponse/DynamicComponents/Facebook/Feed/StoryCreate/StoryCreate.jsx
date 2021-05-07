import "./StoryCreate.css";
import { Avatar } from "@material-ui/core";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { useState } from "react";
import NewModal from '../Post/NewModal';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const StoryCreate = () => {
  const [modalOpen , setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  const handlePhotoVideo = (e) => {
    e.preventDefault();
  };

  return (
    <>
    <div className="storyCreate">
      <div className="storyCreateTop">
        <Avatar />
        <form>
          <input
          onClick={openModal}
          className="createStoryInputText"
          placeholder="What's on your mind?" />
        </form>
      </div>

      <div className="postOptions">
        {<div className="postOption" onClick={handlePhotoVideo}>
          <PhotoLibraryIcon style={{ color: '#31A24C' }}/>
          <p style={{color: 'grey', paddingTop: '4px'}}>Photo/Video</p>
        </div>}
        <div className="postOption">
          <PersonAddIcon style={{ color: '#1877F2' }}/>
          <p>Tag Friends</p>
        </div>
        <div className="postOption onlyLargeScreen">
          <InsertEmoticonIcon style={{ color: '#F5C33B' }} />
          <p>Feeling/Activity</p>
        </div>
    </div>
    </div>
    {modalOpen && <NewModal setModalOpen={setModalOpen}/>}
    </>
  );
}

export default StoryCreate;