import "./Post.css";
import { Container, Modal } from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import InfoIcon from '@material-ui/icons/Info';
import { SEE_WHY_MODAL } from '../../../../../../../constants';

const SeeWhyModal = ({ link, setModalOpen }) => {
  const handleClose = () => {
    setModalOpen(false)
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
              <h2 className="modalTopFont">{SEE_WHY_MODAL.FALSE}</h2>
              <div className="modalTopBtn">
                <ClearIcon className="btn" onClick={handleClose} />
              </div>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              margin: "16px"
            }}>
              <div style={{
                fontWeight: 900
              }}>
                {SEE_WHY_MODAL.ABOUT_THIS_NOTICE}
              </div>
              <br>
              </br>
              <div className="footNoteLabelTop">
                <div className="footNoteLabelIcon">
                  <InfoIcon fontSize="large"/>
                </div>
                <div style={{
                  fontWeight: 300
                }}>
                  {link !== '' && link !== '#' ?
                    <a href={link} style={{ textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                      {SEE_WHY_MODAL.INDEPENDENT_FACT_CHECKERS}
                    </a>
                    :
                    SEE_WHY_MODAL.INDEPENDENT_FACT_CHECKERS
                  }
                  {" "}
                  {SEE_WHY_MODAL.SAY_THIS_INFORMATION_HAS_NO_BASIS_IN_FACT}
                </div>
              </div>
            </div>
          </div>
        </Container>
      }
    </Modal>
  );
};

export default SeeWhyModal;