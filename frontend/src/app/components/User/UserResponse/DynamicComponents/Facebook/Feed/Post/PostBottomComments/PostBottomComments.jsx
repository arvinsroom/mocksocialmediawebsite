import { useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import { selectSocialMediaAuthor } from '../../../../../../../../selectors/socialMediaAuthors';
import DynamicMediaProfile from "../../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMediaProfile";
import "./PostBottomComments.css";

const PostBottomComments = ({ commentMetaData }) => {
  const singleAuthor = commentMetaData.authorId ? useSelector(state => selectSocialMediaAuthor(state, commentMetaData.authorId)) : null;
  const userRegisterData = useSelector(state => state.userRegister.metaData);

  return (
    <div className="fbListComments">
    {
      commentMetaData.attachedAuthorPicture ? 
      <DynamicMediaProfile attachedMedia={commentMetaData.attachedAuthorPicture} customCSS="fbAuthorProfileImage" /> :
      <Avatar
        src={commentMetaData.userComment ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
        className="fbPostTopAvatar"
      />
    }
    <div className="fbCommentBar">
      <div className="displayIndividualUserName">
        {
          singleAuthor ? singleAuthor.authorName || "" :
          commentMetaData.userComment ? (userRegisterData['USERNAME'] || "") : ""
        }
      </div>

      <div className="displayIndividualComment">
        {commentMetaData.comment}
      </div>
    </div>
  </div>
  )
}

export default PostBottomComments;