import React from 'react';

class Provider extends React.Component {

    getChildContext() {

        const store = this.props.store;

        return {
            store,
        }
    }

    render() {
        const {
            children
        } = this.props;

        return (
            <div>
                { children }
            </div>
        );
    }
}

Provider.propTypes = {
    store: React.PropTypes.object,
};

Provider.childContextTypes = {
    store: React.PropTypes.shape({
        getState: React.PropTypes.func,
        update: React.PropTypes.func
    }),
};

export default Provider;