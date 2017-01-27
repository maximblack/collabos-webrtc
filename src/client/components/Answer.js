import React, { Component } from 'react';
import styled from 'styled-components';
import Button from './Button';

export const EVENT_REJECT_CALL = 'EVENT_REJECT_CALL';

export const STATE_IDLE = 'STATE_IDLE';
export const STATE_CALLING = 'STATE_CALLING';
export const STATE_IN_CALL = 'STATE_IN_CALL';
export const STATE_CALL_ERROR = 'STATE_CALL_ERROR';

const AnswerButton = styled(Button)`
    background: #4DD0E1;
`;

export const StopCallButton = styled(Button)`
    background: #FF7043;
`;

class Answer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            state: STATE_IDLE,
            error: null
        };

        this.answerCall = this.answerCall.bind(this);
        this.rejectCall =  this.rejectCall.bind(this);

    }

    componentDidMount() {

        const state = this.context.store.getState();
        const peer = state.peer;

        peer.on('call', (call) => {

            // Filter the call from other peers
            if(call.peer !== this.props.peer)
                return;

            // Get the connection and store it
            peer.on('connection', (dataConnection) => {
                this.connection = dataConnection;
            });

            this.setState({
                state: STATE_CALLING
            });

            // Store the call
            this.call = call;

        });

    }

    answerCall() {

        const call = this.call;
        if(call === undefined) {
            return this.setState({
                state: STATE_CALL_ERROR,
                error: `Internal error`
            });
        }

        const audio = this.refs.audio;

        navigator.getUserMedia({
            audio: true
        }, (stream) => {

            // Bind stream and call instances for future use
            this.destroyCall = this.destroyCall.bind(this, stream, call);

            call.answer(stream);
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

        }, error => {
            this.setState({
                state: STATE_CALL_ERROR,
                error
            });
        });

    }

    rejectCall() {
        this.connection.send({
            event: EVENT_REJECT_CALL,
        });
        this.destroyCall();
    }

    destroyCall(stream, call) {

        if(stream && call) {
            // MediaStream.stop() is deprecated in Chrome 49, so traverse all tracks to stop
            stream.stop && stream.stop() || stream.getTracks().forEach(track => track.stop());

            // Close the call
            call.close();
        }

        this.setState({
            state: STATE_IDLE,
        });
    }

    render() {

        let state;
        switch(this.state.state) {
            case STATE_IDLE:
                state = null; break;
            case STATE_CALLING:
                state = ([
                    <AnswerButton
                        onClick={this.answerCall}
                    >
                        Answer the call
                    </AnswerButton>,
                    <StopCallButton
                        onClick={this.rejectCall}
                    >
                        Reject call
                    </StopCallButton>
                ]); break;
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

Answer.propTypes = {
    peer: React.PropTypes.string.isRequired,
};

Answer.contextTypes = {
    store: React.PropTypes.object,
};

export default Answer;