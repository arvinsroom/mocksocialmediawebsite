import { getUserRegisterDetails, createUserRegister } from '../../../../services/register-service';
import { useEffect, useState } from "react";
import { Button, Input, Container, Avatar, Fab, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../style';
import { showErrorSnackbar, showInfoSnackbar, showSuccessSnackbar } from '../../../../actions/snackbar';
import "./Register.css";
import { updateFlowActiveState } from '../../../../actions/flowState';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../constants';
import cloneDeep from 'lodash/cloneDeep';

const Register = ({ data }) => {
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);
  const [registerState, setRegisterState] = useState([]);
  // const [avatar, setAvatar] = useState("");
  const [registerStateRes, setRegisterStateRes] = useState({});

  const dispatch = useDispatch();
  const classes = useStyles();

  const fetch = async () => {
    const ret = await getUserRegisterDetails(data._id);
    const registerStateArr = ret.data?.response || [];
    // create a dynamic normalized response
    if (registerStateArr && registerStateArr.length > 0) {
      const response = {};
      for (let i = 0; i < registerStateArr.length; i++) {
        response[registerStateArr[i]._id] = {
          displayName: registerStateArr[i].displayName,
          referenceValue: registerStateArr[i].referenceValue,
          required: registerStateArr[i].required,
          storeResponse: registerStateArr[i].storeResponse,
          value: ""
        };
        if (registerStateArr[i].type === 'IMAGE') {
          response[registerStateArr[i]._id] = {
            ...response[registerStateArr[i]._id],
            avatar: ""
          }
        }
      }
      await setRegisterStateRes(response);
      await setRegisterState(registerStateArr);
    }
  };

  useEffect(() => {
    if (!isLoggedInUser) return <Redirect to="/" />;
    fetch();
  }, []);

  const checkValidity = () => {
    for (const [, result] of Object.entries(registerStateRes)) {
      if (!result.value && result.required) return false;
    }
    return true;
  }

  const handleClick = async e => {
    e.preventDefault();

    try {
      if (checkValidity()) {
        // check validity before sending the data
        // let formData = new FormData();
        // formData.append("file", registerState?.profilePic || null);
        // formData.append("username", registerState?.username || null);
        // await createUserRegister(formData);

        // for now save the result in redux store
        // dispatch(saveUserRegistrationDetails(registerStateRes));
        dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
        dispatch(updateFlowActiveState());
      } else {
        dispatch(showInfoSnackbar((translations?.please_answer_all_required_questions_to_continue) || USER_TRANSLATIONS_DEFAULT.ENTER_REQUIRED_INFO));
      }
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch(showErrorSnackbar(resMessage));
    }
  };

  const handleTextField = async (_id, e) => {
    e.preventDefault();
    let newResState = cloneDeep(registerStateRes);
    newResState[_id] = {
      ...newResState[_id],
      value: e.target.value
    };
    await setRegisterStateRes(newResState);
  };

  const handleFileField = async (_id, e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      let newResState = cloneDeep(registerStateRes);
      newResState[_id] = {
        ...newResState[_id],
        avatar: URL.createObjectURL(e.target.files[0]),
        value: e.target.files[0]
      };
      await setRegisterStateRes(newResState);
    }
  }

  const renderDynamicInput = (field) => {
    if (field.type === 'IMAGE') {
      return (
        <div className="registerTop">
          <Avatar
            src={registerStateRes[field._id].avatar}
            className="registerTopAvatar"
          />
          <label htmlFor="upload-photo">
          <Input
            style={{ display: "none" }}
            id="upload-photo"
            name="profilePic"
            type="file"
            inputProps={{ multiple: false }}
            accept={field.type.toLowerCase() + '/*'}
            onChange={(e) => handleFileField(field._id, e)}
            required={field.required}
          />
          <Fab
            className="registerTopInput"
            color="primary"
            size="small"
            component="span"
            aria-label="add"
            variant="extended">
            <AddIcon /> {translations?.upload || USER_TRANSLATIONS_DEFAULT.UPLOAD}
          </Fab>
        </label>
      </div>
      );
    } else {
      // 'text', 'number', 'email', 'password', 'date'
      return (
        <TextField
          className={classes.marginBottom}
          variant="outlined"
          margin="normal"
          fullWidth
          type={field.type.toLowerCase()}
          required={field.required}
          name={field.referenceValue}
          value={registerState.username}
          label={field.displayName}
          onChange={(e) => handleTextField(field._id, e)}
        />
      );
    }
  };

  return (
    <Container component="main" maxWidth="md" className={classes.card}>
      {registerState?.length > 0 && registerState.map(field => (
        <div key={field._id}>
          {renderDynamicInput(field)}
        </div>
      ))}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ float: 'right', width: '25%' }}
        onClick={handleClick}
        className={classes.submit}
      >
        <ArrowForwardIosIcon style={{ fontSize: 15 }} />
      </Button>
    </Container>
  );
};

export default Register;