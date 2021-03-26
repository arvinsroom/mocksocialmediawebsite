import Admin from './Admin/Admin';
import UserLogin from './UserLogin/UserLogin';
import UserResponse from './UserResponse/UserResponse';
import Configure from './Configure/Configure';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SuccessSnackbar from './Snackbar';

function App() {
  return (
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
          <Route exact path="/user-response">
            <UserResponse />
          </Route>
          <Route exact path="/">
            <UserLogin />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
