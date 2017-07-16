import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Dropdown,Icon, Button, Menu} from 'semantic-ui-react'
import PropTypes from 'prop-types'

import autobind from 'autobind-decorator'
import {observer} from 'mobx-react'

@observer
export default class ProfileButton extends Component {

    @autobind
    handleLogin () {
        this.props.history.push('#')
    }

    render() {
        const { store } = this.props
        return store.isAuthenticated && store.user ? (
            <Dropdown trigger={<span>
                <Icon name='user circle outline' /> Hello, { store.user.FirstName }
            </span>} pointing>
                <Dropdown.Menu>
                    <Dropdown.Item disabled>Signed in as <strong>{store.user.LastName + ' , ' + store.user.FirstName }</strong></Dropdown.Item>
                    <Dropdown.Item><Link to={'#'}>Profile</Link></Dropdown.Item>
                    <Dropdown.Item><Link to={'/logout'}>Logout</Link></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> ):(
            <Button primary onClick={this.handleLogin}> Login </Button>
        )
    }

}

ProfileButton.propTypes = {
    store : PropTypes.shape({
        isAuthenticated: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired
    })
}

ProfileButton.defaultProps = {
    store : {
        isAuthenticated: false,
        user : {}
    }
}
