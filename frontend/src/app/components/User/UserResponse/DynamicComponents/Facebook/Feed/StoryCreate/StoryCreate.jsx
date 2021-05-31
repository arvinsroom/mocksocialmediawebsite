import "./StoryCreate.css";
import { Avatar } from "@material-ui/core";
import { useSelector } from "react-redux";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { useState } from "react";
import NewModal from '../Post/NewModal';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { FB_TRANSLATIONS_DEFAULT } from '../../../../../../../constants';

const StoryCreate = () => {
  const fbTranslations = useSelector(state => state.facebook.fbTranslations);
  const userRegisterData = useSelector(state => state.userRegister.metaData);

  const [modalOpen , setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  const translate = (...words) => {
    const word1 = fbTranslations?.[words[0]] || null;
    const word2 = fbTranslations?.[words[1]] || null;
    const finalWord1 = word1 ? word1 : FB_TRANSLATIONS_DEFAULT[words[0].toUpperCase()];
    const finalWord2 = word2 ? word2 : FB_TRANSLATIONS_DEFAULT[words[1].toUpperCase()];
    return finalWord1 + '/' + finalWord2;
  };

  return (
    <>
    <div className="storyCreate">
      <div className="storyCreateTop">
        <Avatar 
          src={userRegisterData['PROFILEPHOTO'] || ""}
        />
        <form>
          <input
            onClick={openModal}
            className="createStoryInputText"
            placeholder={fbTranslations?.["what's_on_your_mind?"] || FB_TRANSLATIONS_DEFAULT.WHATS_ON_YOUR_MIND} />
        </form>
      </div>

      <div className="postOptions">
        {<div className="postOption" onClick={openModal}>
          <PhotoLibraryIcon style={{ color: '#31A24C' }}/>
          <p style={{color: 'grey', paddingTop: '4px'}}><b>{translate('photo', 'video')}</b></p>
        </div>}
        <div className="postOption">
          <PersonAddIcon style={{ color: '#1877F2' }}/>
          <p><b>{fbTranslations?.tag_friends || FB_TRANSLATIONS_DEFAULT.TAG_FRIENDS}</b></p>
        </div>
        <div className="postOption onlyLargeScreen">
          <InsertEmoticonIcon style={{ color: '#F5C33B' }} />
          <p><b>{translate('feeling', 'activity')}</b></p>
        </div>
    </div>
    </div>
    {modalOpen && <NewModal setModalOpen={setModalOpen}/>}
    </>
  );
}

export default StoryCreate;