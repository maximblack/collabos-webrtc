import React, { Component } from 'react';
import styled from 'styled-components';
import config from '../../../config';
import Call from '../components/Call';
import Answer from '../components/Answer';

const Container = styled.div`
    width: 990px;
    margin: 0 auto;
`;

const Participant = styled.div`
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 10px 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
`;

const NameContainer = styled.div`
    flex: 1;
`;

const ButtonsContainer = styled.div`
    & > * {
        display: inline-block;
    }
    & button {
       margin-left: 10px;
   }
`;

class Peers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            calling: null,
            peers: []
        };

        this.call = this.call.bind(this);
        this._updatePeers = this._updatePeers.bind(this);
    }

    componentDidMount() {
        this._updatePeers && setInterval(this._updatePeers, 2000);
    }

    call(peerId) {
        this.setState({
            calling: peerId
        });
    }

    _updatePeers() {

        const store = this.context.store;
        const state = store.getState();
        // todo: transform user to compound object
        const loggedPeer = state.user;

        fetch(`//${config.host}:${config.serverPort}${config.peerPath}/${config.peerKey}/peers`)
            .then(response => {
                const contentType = response.headers.get('content-type');
                if(contentType && contentType.indexOf('application/json') !== -1) {
                    response.json().then((peers) => {
                        this.setState({
                            peers: peers.filter((peer) => {
                                return peer !== loggedPeer;
                            })
                        });
                    });
                }
            });
        return true;
    }

    render() {
        return (
            <Container>
                <h3>Peers online</h3>
                {
                    this.state.peers.length > 0 && this.state.peers.map((peer) => (
                        <Participant
                            key={peer}
                        >
                            <NameContainer>
                                {peer}
                            </NameContainer>
                            <ButtonsContainer>
                                <Call
                                    peer={peer}
                                />
                                <Answer
                                    peer={peer}
                                />
                            </ButtonsContainer>
                        </Participant>
                    )) || (
                        <div>No active peers</div>
                    )
                }
            </Container>
        );
    }

}

Peers.contextTypes = {
    store: React.PropTypes.object,
};

export default Peers;