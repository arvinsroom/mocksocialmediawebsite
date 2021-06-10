import { getUserRegisterDetails } from '../../../../../services/register-service';
// import { createUserRegister } from '../../../../../services/register-service';
import { useEffect, useState } from "react";
import { Button, Input, Avatar, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../../style';
import { showErrorSnackbar, showInfoSnackbar, showSuccessSnackbar } from '../../../../../actions/snackbar';
import { updateFlowActiveState } from '../../../../../actions/flowState';
import { setRegisterMetaData } from '../../../../../actions/userRegister';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../../constants';
import cloneDeep from 'lodash/cloneDeep';
import { IconCloudUpload, IconChevronRight } from '@tabler/icons';
import "./Register.css";

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
          referenceName: registerStateArr[i].referenceName,
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

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (checkValidity()) {
        // check validity before sending the data
        // let formData = new FormData();
        // formData.append("file", registerState?.profilePic || null);
        // formData.append("username", registerState?.username || null);
        // await createUserRegister(formData);

        // for now save the result in redux store
        const metaData = {};
        // get the profile pic and username to store in the redux state
        for (const [, value] of Object.entries(registerStateRes)) {
          if (value.value) {
            if (value.referenceName === 'PROFILEPHOTO') metaData[value.referenceName] = URL.createObjectURL(value.value);
            else metaData[value.referenceName] = value.value;
          }
        }
        dispatch(setRegisterMetaData(metaData));
        dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
        dispatch(updateFlowActiveState());
      } else {
        dispatch(showInfoSnackbar((translations?.['please_answer_all_required_questions_to_continue.']) || USER_TRANSLATIONS_DEFAULT.ENTER_REQUIRED_INFO));
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
        <Button
          variant="contained"
          component="label"
          startIcon={<IconCloudUpload />}
        >
          {translations?.upload || USER_TRANSLATIONS_DEFAULT.UPLOAD}
          <Input
            style={{ display: "none" }}
            id="upload-photo"
            name="profilePic"
            type="file"
            inputProps={{ multiple: false }}
            accept={field.type.toLowerCase() + '/*'}
            onChange={(e) => handleFileField(field._id, e)}
          />
        </Button>
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
          style={{ fontFamily: 'Noto Sans, sans-serif' }}
          type={field.type.toLowerCase()}
          required={field.required}
          name={field.referenceName}
          value={registerState.username}
          label={field.displayName}
          onChange={(e) => handleTextField(field._id, e)}
        />
      );
    }
  };

  return (
  <>
      {registerState?.length > 0 && registerState.map(field => (
        <div key={field._id}>
          {renderDynamicInput(field)}
        </div>
      ))}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className={classes.submit}
        endIcon={<IconChevronRight />}
      >
        {translations?.next || "NEXT"}
      </Button>
      </>
  );
};

export default Register;