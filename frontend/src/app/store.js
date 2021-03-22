import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from "./reducers";
import thunk from "redux-thunk";

const middleware = [thunk];

// FOR DEVELOPMENT, dev tool
const store = createStore(rootReducer,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
export default store;
