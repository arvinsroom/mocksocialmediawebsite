import Admin from './Admin/Admin';
import UserLogin from './UserLogin/UserLogin';
import UserLoginWithQualtricsId from './UserLogin/UserLoginWithQualtricsId';
import UserResponse from './UserResponse/UserResponse';
import Configure from './Configure/Configure';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SuccessSnackbar from './Snackbar';

function App() {
  return (
    <>
    <div className="wrapper">
      <SuccessSnackbar />
      <BrowserRouter>
        <Switch>
          <Route exact path="/admin/configure">
            <Configure />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route exact path="/:accessCode/user-response">
            <UserResponse />
          </Route>
          <Route exact path="/:accessCode/qualtrics">
            <UserLoginWithQualtricsId />
          </Route>
          <Route exact path="/:accessCode?">
            <UserLogin />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
    </>
  );
}

export default App;
