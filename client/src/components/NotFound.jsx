import React, {Component} from 'react';
import {Header, Icon, Grid, Image, Container} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class NotFound extends Component {

    render() {
        return (
            <div className="centerChildren">
                <Header as='h2' textAlign="center" icon>
                    <Icon name={this.props.icon}/>
                    { this.props.message }
                </Header>
            </div>
        );
    }

}

NotFound.propTypes = {
    message: PropTypes.string,
    icon : PropTypes.string
}


NotFound.defaultProps = {
    message: "Page Not Found",
    icon: "settings"
}
