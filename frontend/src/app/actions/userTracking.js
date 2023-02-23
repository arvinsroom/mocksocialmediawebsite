import * as UserTrackingService from '../services/user-tracking-service';

export const trackUserClick = (data) => (dispatch) => {
  return UserTrackingService.trackLinkClick({ trackObj: data }).then(
    () => {
      return Promise.resolve();
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};