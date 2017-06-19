import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown,Icon, Button, Menu} from 'semantic-ui-react'
import PropTypes from 'prop-types';

export default class ProfileButton extends Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin () {
        this.props.history.push('/login');
    }

    render() {
        return this.props.isAuthenticated && this.props.user ? (
                <Dropdown trigger={<span>
                                        <Icon name='user circle outline' /> Hello, { this.props.user.FirstName }
                                    </span>} pointing>
                    <Dropdown.Menu>
                        <Dropdown.Item disabled>Signed in as <strong>{this.props.user.LastName + ' , ' + this.props.user.FirstName }</strong></Dropdown.Item>
                        <Dropdown.Item><Link to={'#'}>Profile</Link></Dropdown.Item>
                        <Dropdown.Item><Link to={'/logout'}>Logout</Link></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> ):(
                    <Button primary onClick={this.handleLogin}> Login </Button>
            )
    }

}

ProfileButton.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    user : PropTypes.object.isRequired
}

ProfileButton.defaultProps = {
    isAuthenticated: false,
    user : {}
}
