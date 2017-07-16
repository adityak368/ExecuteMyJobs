import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ProfileButton from 'components/ProfileButton';
import {Menu,Dropdown,Button,Icon} from 'semantic-ui-react'
import PropTypes from 'prop-types';

export default class Navbar extends Component {

    constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.state = {}
    }

    handleItemClick(e, {name}) {
        this.setState({activeItem: name});
        this.props.history.push(`/${name}`);
    }

    render() {
        return (
            <Menu stackable size='huge'>
                <Menu.Item >
                        <Link to={'/'}><Icon name="product hunt" />  Execute My Jobs</Link>
                </Menu.Item>

                <Menu.Item name='agents' active={this.state.activeItem === 'agents'}  onClick={this.handleItemClick}>
                        <Icon name="desktop" /> Agents
                </Menu.Item>

                <Menu.Item name='jobs' active={this.state.activeItem === 'jobs'}  onClick={this.handleItemClick}>
                        <Icon name="announcement" /> Jobs
                </Menu.Item>


                <Menu.Menu position='right'>
                    <Menu.Item>
                        <ProfileButton {...this.props}/>
                    </Menu.Item>
                </Menu.Menu>
            </Menu >
        );
    }

}

Navbar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    user : PropTypes.object.isRequired
}

Navbar.defaultProps = {
    isAuthenticated: false,
    user : {}
}
