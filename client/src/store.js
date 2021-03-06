import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import usersReducer from './reducers/index';

const store = createStore(usersReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk));

export default store;
