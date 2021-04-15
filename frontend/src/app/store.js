import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from "./reducers";
import thunk from "redux-thunk";

const middleware = [thunk];
// const devTools = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : null

// FOR DEVELOPMENT, dev tool
const store = createStore(rootReducer,
  compose(
    applyMiddleware(...middleware))
  );
export default store;
