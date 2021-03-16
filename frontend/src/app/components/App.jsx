import Admin from './Admin/Admin';
import Home from './Configure/AdminConfigurePortal/Home/Home';
import Configure from './Configure/Configure';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          < Route exact path="/admin/configure">
            <Configure />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
