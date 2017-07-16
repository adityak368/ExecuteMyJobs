import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import NoAgentsFound from 'components/NotFound'
import {handleError} from 'commons/errorhandler'
import {fetchAgents} from 'api/api'
import {Menu, Segment, Container, Icon, List} from 'semantic-ui-react'

export default class Agents extends Component {

    constructor(props) {
        super(props)
        this.handleItemClick = this.handleItemClick.bind(this)
        this.state = {
            connectedAgents: [],
            disconnectedAgents: [],
            unauthorizedAgents: [],
            activeItem: 'connectedAgents'
        }
    }

    handleItemClick(e, {name}) {
        this.setState({activeItem: name})
    }


    componentDidMount() {

        fetchAgents()
            .then((allAgents) => {
                let connectedAgents = allAgents.filter((agent) => agent.isConnected)
                let disconnectedAgents = allAgents.filter((agent) => !agent.isConnected)
                let unauthorizedAgents = allAgents.filter((agent) => !agent.isAuthorized)
                this.setState({
                    connectedAgents,
                    disconnectedAgents,
                    unauthorizedAgents
                })
            }).catch((error) => handleError(error))

    }

    render() {
        const connectedAgents = this.state.connectedAgents.length == 0 ? <NoAgentsFound msg={'No Agents Found'}/> : this.state.connectedAgents.map((agent) =>
            <List.Item key={agent.name}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header><Link to={`/agents/${agent.name}`}><strong>{agent.name}</strong></Link></List.Header>
                    <List.Description>{agent.description}</List.Description>
                </List.Content>
            </List.Item>)

        const disconnectedAgents = this.state.disconnectedAgents.length == 0 ? <NoAgentsFound msg={'No Agents Found'}/> : this.state.disconnectedAgents.map((agent) =>
            <List.Item key={agent.name}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header><Link to={`/agents/${agent.name}`}><strong>{agent.name}</strong></Link></List.Header>
                    <List.Description>{agent.description}</List.Description>
                </List.Content>
            </List.Item>)

        const unauthorizedAgents = this.state.unauthorizedAgents.length == 0 ? <NoAgentsFound msg={'No Agents Found'}/> : this.state.unauthorizedAgents.map((agent) =>
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
                        ({this.state.connectedAgents.length})</Menu.Item>
                    <Menu.Item name='disconnected_agents' active={activeItem === 'disconnected_agents'}
                        onClick={this.handleItemClick}><Icon name="shutdown"/>  Disconnected Agents
                        ({this.state.disconnectedAgents.length})</Menu.Item>
                    <Menu.Item name='unauthorized_agents' active={activeItem === 'unauthorized_agents'}
                        onClick={this.handleItemClick}><Icon name="shield" />  UnAuthorized Agents
                        ({this.state.unauthorizedAgents.length})</Menu.Item>
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
