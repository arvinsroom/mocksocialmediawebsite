import * as UserMainService from '../services/user-main-service';

export const updateUserMain = (data) => (dispatch) => {
  return UserMainService.updateUser({ userObj: data }).then(
    () => {
      return Promise.resolve();
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
