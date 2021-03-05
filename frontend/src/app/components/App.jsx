import Admin from './Admin/Admin';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
