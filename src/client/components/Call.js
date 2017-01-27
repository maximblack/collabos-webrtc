import React, { Component } from 'react';
import styled from 'styled-components';
import Button from './Button';

import {
    EVENT_REJECT_CALL,
    STATE_IDLE,
    STATE_CALLING,
    STATE_IN_CALL,
    STATE_CALL_ERROR,
    StopCallButton,
} from './Answer';

export const CallButton = styled(Button)`
    background: #81C784;
`;

class Call extends Component {

    constructor(props) {
        super(props);

        this.state = {
            state: STATE_IDLE,
            error: null
        };

        this.call = this.call.bind(this);
    }

    // Update the component only when the peer or the state of call changes
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps.peer === this.props.peer && nextState.state === this.state.call);
    }

    destroyCall(stream, call) {
        // MediaStream.stop() is deprecated in Chrome 49, so traverse all tracks to stop
        stream.stop && stream.stop() || stream.getTracks().forEach(track => track.stop());

        // Close the call
        call.close();

        this.setState({
            state: STATE_IDLE,
        });
    }

    call() {

        const state = this.context.store.getState();
        const peer = state.peer;

        const audio = this.refs.audio;

        navigator.getUserMedia({
            audio: true
        }, (stream) => {
            const call = peer.call(this.props.peer, stream);

            this.setState({
                state: STATE_CALLING,
            });

            // Bind stream and call instances for future use
            this.destroyCall = this.destroyCall.bind(this, stream, call);

            call.on('stream', (remoteStream) => {
                audio.src = window.URL.createObjectURL(remoteStream);
                audio.onloadedmetadata = (e) => {
                    this.setState({
                        state: STATE_IN_CALL,
                    });
                    audio.play();
                }
            });

            call.on('close', this.destroyCall);

            // Connects to the remote peer
            const connection = peer.connect(this.props.peer);

            // Catches the data event
            connection.on('data', (data) => {
                switch(data.event) {
                    case EVENT_REJECT_CALL:
                        return this.destroyCall();
                }
            });

        }, function(error) {
            this.setState({
                state: STATE_CALL_ERROR,
                error
            });
        });
    }

    render() {

        let state;
        switch(this.state.state) {
            case STATE_IDLE:
                state = (
                    <CallButton
                        onClick={this.call}
                    >
                        Call
                    </CallButton>
                ); break;
            case STATE_CALLING:
                state = 'Calling...'; break;
            case STATE_IN_CALL:
                state = (
                    <StopCallButton
                        onClick={this.destroyCall}
                    >
                        Stop call
                    </StopCallButton>
                ); break;
            case STATE_CALL_ERROR:
                state = this.state.error; break;
        }

        return (
            <div>
                {state}
                <audio
                    ref="audio"
                    //controls
                />
            </div>
        );
    }

}

Call.propTypes = {
    peer: React.PropTypes.string.required,
};

Call.contextTypes = {
    store: React.PropTypes.object,
};

export default Call;