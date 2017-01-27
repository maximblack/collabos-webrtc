import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import 'isomorphic-fetch';
import Provider from './containers/Provider';
import Layout from './components/Layout';
import UserPage from './pages/User';
import PeersPage from './pages/Peers';
import store from './containers/store';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function requireAuth(store, nextState, replace) {
    const state = store.getState();
    if(state.user === null) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

const App = () => (
    <Provider
        store={store}
    >
        <Router
            history={browserHistory}
        >
            <Route path="/" component={Layout}>
                <Route
                    path="/login"
                    component={UserPage}
                />
                <Route
                    path="/peers"
                    component={PeersPage}
                    onEnter={requireAuth.bind(null, store)}
                />
            </Route>
        </Router>
    </Provider>
);

export default App;
