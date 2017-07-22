import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import NoAgentsFound from 'components/NotFound'
import {handleError} from 'commons/errorhandler'
import {fetchAgents } from 'api/api'
import {Menu, Segment, Container, Icon, List} from 'semantic-ui-react'

import {observer, PropTypes as MobxPropTypes} from 'mobx-react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

@observer
export default class Agents extends Component {

    state = {
        activeItem: 'connectedAgents'
    }

    @autobind
    handleItemClick(e, {name}) {
        this.setState({activeItem: name})
    }

    componentDidMount() {
        const { store } = this.props
        fetchAgents()
            .then((agents) => {
                store.agents = agents
            }).catch((error) => handleError(error))
    }

    render() {
        const { store } = this.props
        const connectedAgents = store.connectedAgents.length == 0 ? <NoAgentsFound msg={'No Agents Found'}/> : store.connectedAgents.map((agent) =>
            <List.Item key={agent.name}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header><Link to={`/agents/${agent.name}`}><strong>{agent.name}</strong></Link></List.Header>
                    <List.Description>{agent.description}</List.Description>
                </List.Content>
            </List.Item>)

        const disconnectedAgents = store.disconnectedAgents.length == 0 ? <NoAgentsFound msg={'No Agents Found'}/> : store.disconnectedAgents.map((agent) =>
            <List.Item key={agent.name}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header><Link to={`/agents/${agent.name}`}><strong>{agent.name}</strong></Link></List.Header>
                    <List.Description>{agent.description}</List.Description>
                </List.Content>
            </List.Item>)

        const unauthorizedAgents = store.unauthorizedAgents.length == 0 ? <NoAgentsFound msg={'No Agents Found'}/> : store.unauthorizedAgents.map((agent) =>
            <List.Item key={agent.name}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header><Link to={`/agents/${agent.name}`}><strong>{agent.name}</strong></Link></List.Header>
                    <List.Description>{agent.description}</List.Description>
                </List.Content>
            </List.Item>)

        const {activeItem} = this.state

        return (
            <Container>
                <Menu attached='top' tabular>
                    <Menu.Item name='connectedAgents' active={activeItem === 'connectedAgents'}
                        onClick={this.handleItemClick}><Icon name="signal" /> Connected Agents
                        ({store.connectedAgents.length})</Menu.Item>
                    <Menu.Item name='disconnected_agents' active={activeItem === 'disconnected_agents'}
                        onClick={this.handleItemClick}><Icon name="shutdown"/>  Disconnected Agents
                        ({store.disconnectedAgents.length})</Menu.Item>
                    <Menu.Item name='unauthorized_agents' active={activeItem === 'unauthorized_agents'}
                        onClick={this.handleItemClick}><Icon name="shield" />  UnAuthorized Agents
                        ({store.unauthorizedAgents.length})</Menu.Item>
                </Menu>

                <Segment attached='bottom'>
                    <List divided relaxed>
                        { activeItem === 'connectedAgents' ? connectedAgents : activeItem === 'disconnected_agents' ? disconnectedAgents : unauthorizedAgents }
                    </List>
                </Segment>
            </Container>
        )
    }

}

Agents.propTypes = {
    store : PropTypes.shape({
        allAgents : MobxPropTypes.observableArray.isRequired   
    })
}

Agents.defaultProps = {
    store :{
        allAgents : []
    }
}