import React, { Component } from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
import config from '../../../config';

import Button from '../components/Button';

const Container = styled.div`
    width: 990px;
    margin: 0 auto;
`;

const FormField = styled.div`
    margin: 10px 0;
    
    & input {
        border: 1px solid #ddd;
        border-radius: 2px;
        padding: 5px 10px;
    }
`;

class User extends Component {

    constructor(props) {
        super(props);

        this.state = {
            login: 'peer1',
            password: 'peer1',
        };

        this.login = this.login.bind(this);
        this.onLoginChange = this.onLoginChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);

    }

    login() {

        const login = this.state.login;
        const password = this.state.password;

        // Login logic, using JWT, Sessions

        const peerId = login;

        // Creating new peer
        const peer = new Peer(peerId, {
            host: config.host,
            port: config.serverPort,
            path: config.peerPath,
            debug: config.debug && 3 || 0
        });

        // Update store with user
        this.context.store.update((state) => {
            return Object.assign({}, state, {
                user: this.state.login,
                peer,
            });
        }, () => {
            // Redirect to peers
            browserHistory.push('/peers');
        });
    }

    onLoginChange(event) {
        this.setState({
            login: event.target.value,
        });
    }

    onPasswordChange(event) {
        this.setState({
            password: event.target.value,
        });
    }

    render() {
        return (
            <Container>
                <h3>Login</h3>
                <FormField>
                    <input
                        onChange={this.onLoginChange}
                        type="text"
                        value={this.state.login}
                    />
                </FormField>
                <FormField>
                    <input
                        onChange={this.onPasswordChange}
                        type="password"
                        value={this.state.password}
                    />
                </FormField>
                <Button
                    onClick={this.login}
                >
                    Login
                </Button>
            </Container>
        );
    }

}

User.contextTypes = {
    store: React.PropTypes.object,
};

export default User;