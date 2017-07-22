import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ProfileButton from 'components/ProfileButton'
import {Menu,Dropdown,Button,Icon,Label} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { fetchNumberOfAgents} from 'api/api'

import autobind from 'autobind-decorator'
import {observer} from 'mobx-react'

@observer
export default class Navbar extends Component {

    state = {agentCount : 0}
    
    componentDidMount() {
        fetchNumberOfAgents()
            .then((agentCount) => this.setState({agentCount}))
            .catch((error) => handleError(error))
    }

    @autobind
    handleItemClick (e, {name}) {
        this.setState({activeItem: name})
        this.props.history.push(`/${name}`)
    }

    render() {
        return (
            <Menu stackable size='huge' >
                <Menu.Item >
                    <Link to={'/'}><Icon name="product hunt" />  Execute My Jobs</Link>
                </Menu.Item>

                <Menu.Item name='agents' active={this.state.activeItem === 'agents'}  onClick={this.handleItemClick}>
                    <Icon name="desktop" /> Agents <Label color='blue'> {this.state.agentCount} </Label>
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
        )
    }

}

Navbar.propTypes = {
    store : PropTypes.shape({
        isAuthenticated: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired
    })
}

Navbar.defaultProps = {
    store : {
        isAuthenticated: false,
        user : {}
    }
}
