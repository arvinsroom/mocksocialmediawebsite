import { getUserRegisterDetails, createUserRegister } from '../../../../../services/register-service';
import { useEffect, useState } from "react";
import { Button, Input, Avatar, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import useStyles from '../../../../style';
import { showErrorSnackbar, showInfoSnackbar, showSuccessSnackbar } from '../../../../../actions/snackbar';
import { updateFlowActiveState } from '../../../../../actions/flowState';
import { setRegisterMetaData } from '../../../../../actions/userRegister';
import { 
  USER_TRANSLATIONS_DEFAULT, 
  WINDOW_GLOBAL,
  USER_REGISTER
 } from '../../../../../constants';
import cloneDeep from 'lodash/cloneDeep';
import { IconCloudUpload, IconChevronRight } from '@tabler/icons';
import RenderRichTextArea from '../../../../Common/UserCommon/RenderRichTextArea';
import "./Register.css";

const regex = /^@?[A-Za-z0-9\_]+$/i;

const Register = ({ data }) => {
  const { isLoggedInUser, translations } = useSelector(state => state.userAuth);
  const [registerState, setRegisterState] = useState([]);
  const [handleValidation, setHandleValidation] = useState(true);
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

    window.onbeforeunload = function() {
      return WINDOW_GLOBAL.RELOAD_ALERT_MESSAGE;
    };
  }, []);

  const checkValidity = () => {
    // special case for handle validation
    if (!handleValidation) return false;
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
        let formData = new FormData();
        const regesterIds = [];
        // for now save the result in redux store
        const metaData = {};
        // add a default empty value for off by 1 cases
        metaData.RELATIONSHIP = [''];
        // get the profile pic and username to store in the redux state
        for (const [key, response] of Object.entries(registerStateRes)) {
          const { 
            referenceName,
            value,
            // order,
            storeResponse
          } = response;
          if (value) {
            if (referenceName === 'PROFILEPHOTO') {
              metaData[referenceName] = URL.createObjectURL(value);
              if (storeResponse) {
                regesterIds.push(key);
                // change the file name to key
                const splitArr = value.name.split('.');
                const newFileName = key.toString() + '.' + splitArr[splitArr.length - 1];
                 if (splitArr.length > 0) formData.append("files", value, newFileName);
              }
            }
            else {
              if (referenceName === 'RELATIONSHIP') {
                metaData[referenceName] = [...metaData[referenceName], value];
                // let orderNum = order ? order : -1;
                // metaData.ORDER = metaData.ORDER ? [...metaData.ORDER, orderNum] : [orderNum];
              } else if (referenceName === "HANDLE") {
                if (value && value.length > 0 && value[0] !== '@') value = '@' + value;
                metaData[referenceName] = value;
              } else metaData[referenceName] = value;

              if (storeResponse) {
                regesterIds.push(key);
                formData.append(key, value.toString());
              }
            }
          }
          else {
            if (referenceName === 'RELATIONSHIP') metaData[referenceName] = [...metaData[referenceName], ""];
          }
        }
        if (regesterIds.length > 0) {
          // send the response to db
          formData.append('registerIds', JSON.stringify(regesterIds));
          await createUserRegister(formData);
        }
        await dispatch(setRegisterMetaData(metaData));
        await dispatch(updateFlowActiveState());
        await dispatch(showSuccessSnackbar((translations?.responses_saved) || USER_TRANSLATIONS_DEFAULT.RESPONSES_SAVED));
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
    let value = e.target.value || "";
    let handleState = false;
    if (e.target.name === "HANDLE" && value.length > 0) {
      if (value.length > 15 || !regex.test(value)) {
        handleState = true;
        await setHandleValidation(false);
      } else await setHandleValidation(true);
    }
    if (!handleState) {
      let newResState = cloneDeep(registerStateRes);
      newResState[_id] = {
        ...newResState[_id],
        value: value
      };
      await setRegisterStateRes(newResState);
    } else {
      dispatch(showErrorSnackbar(translations?.['handles_can_start_with_@_or_nothing_and_must_contain_only_alphanumeric_characters_and/or_underscores,_up_to_a_maximum_of_15_characters.']) || USER_REGISTER.REGISTER_HANDLE_PARSING_ERROR);
    }
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
          error={field.referenceName === "HANDLE" ? !handleValidation : false}
          helperText={field.referenceName === "HANDLE" && !handleValidation ? "Invalid Input" : null}
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
      {data?.richText && <RenderRichTextArea richText={data.richText}/>}
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