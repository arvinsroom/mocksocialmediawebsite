import { Container, Modal, Button } from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import InfoIcon from '@material-ui/icons/Info';
import { trackLinkClick } from "../../../../../../../services/user-tracking-service";
import { SHARE_ANYWAY_MODAL } from '../../../../../../../constants';
import "./Post.css";

const ShareAnywayModal = ({ id, link, setModalOpen, setModalShareOpen }) => {
  const handleClose = () => {
    setModalShareOpen(false);
  };

  const handleShareAnyway = () => {
    setModalShareOpen(false);
    setModalOpen(false);
    const track = {
      action: 'SHAREANYWAY',
      userPostId: id
    };
    trackLinkClick({ trackObj: track });
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {
        <Container component="main" className="modalContainerShare" maxWidth="sm">
          <div className="fbModalContainerPaper">
            <div className="modalTop">
              <InfoIcon fontSize="large"/>
              <h2 className="modalTopFrontShareAnyway">{SHARE_ANYWAY_MODAL.FALSE_INFORMATION_IN_THIS_POST}</h2>
              <div className="modalTopBtn">
                <ClearIcon className="btn" onClick={handleClose} />
              </div>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              margin: "16px"
            }}>
              <div className="footNoteLabelTop">
                <div style={{
                  fontWeight: 300
                }}>
                  {link !== '' && link !== '#' ?
                    <a href={link} style={{ textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                      {SHARE_ANYWAY_MODAL.INDEPENDENT_FACT_CHECKERS}
                    </a>
                    :
                    SHARE_ANYWAY_MODAL.INDEPENDENT_FACT_CHECKERS
                  }
                  {" "}
                  {SHARE_ANYWAY_MODAL.SAY_THIS_POST_HAS_FALSE_INFORMATION}
                </div>
              </div>
            </div>
            <div className="shareAnywayBottom">
              <Button
                onClick={handleShareAnyway}
                variant="contained"
                className="shareAnywayMainButton"
                >
                {SHARE_ANYWAY_MODAL.SHARE_ANYWAY}
              </Button>
              <Button
                onClick={handleClose}
                className="shareAnywayGoBackButton"
                variant="contained"
                color="primary"
              >
                {SHARE_ANYWAY_MODAL.GO_BACK}
              </Button>
            </div>
          </div>
        </Container>
      }
    </Modal>
  );
};

export default ShareAnywayModal;