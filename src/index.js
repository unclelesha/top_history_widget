import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import App from 'App';
import {Provider} from 'react-redux';
import {compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from 'redux/rootReducer';
import * as serviceWorker from 'serviceWorker';
import {LocalizationProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


const store = createStore(rootReducer, compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

const app = (
    <Provider store={store}>
        <LocalizationProvider dateAdapter={MomentUtils}>
            <App/>
        </LocalizationProvider>
    </Provider>
);

ReactDOM.render(
    app,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
