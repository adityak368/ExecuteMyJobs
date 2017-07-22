import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Header, Segment, Icon, List, Label, Checkbox, Container, Menu, Popup, Table} from 'semantic-ui-react'
import {fetchAgent, changeAgentAuthorization, changeAgentEnabled, fetchCompatibleConfigurations} from 'api/api'
import NoAgentsFound from 'components/NotFound'
import {handleError} from 'commons/errorhandler'

import {observer, PropTypes as MobxPropTypes} from 'mobx-react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

@observer
export default class Agent extends Component {

    state = {activeItem: 'agent_summary'}
  
    @autobind
    handleItemClick(e, {name}) {
        this.setState({activeItem: name})
    }

    @autobind
    handleCompatibleConfigurationsClicked(e) {
        const { store } = this.props

    }

    componentDidMount() {
        const {store} = this.props
        fetchAgent(this.props.match.params.agentName)
            .then((agent) => store.agent = agent)
            .catch((error) => handleError(error))
    }

    @autobind
    OnAgentAuthorizationChanged(e, data) {
        const {store} = this.props
        store.agent.isAuthorized = data.checked
        changeAgentAuthorization(this.props.match.params.agentName, {
            isAuthorized: data.checked
        }).catch((error) => handleError(error))
    }

    @autobind
    OnAgentStatusChanged(e, data) {
        const {store} = this.props
        store.agent.isEnabled = data.checked
        changeAgentEnabled( this.props.match.params.agentName, {
            isEnabled: data.checked
        }).catch((error) => handleError(error))
    }

    render() {
        const {store} = this.props
        const attrs = []
        for (var attr in store.agent.attributes) {
            if (store.agent.attributes.hasOwnProperty(attr)) {
                attrs.push(
                    <Table.Row key={attr + 'prop'}>
                        <Table.Cell> {attr}</Table.Cell>
                        <Table.Cell className="wrapText">{store.agent.attributes[attr]}</Table.Cell>
                    </Table.Row>)
            }
        }

        const env = []
        for (var attr in store.agent.env) {
            if (store.agent.env.hasOwnProperty(attr)) {
                env.push(
                    <Table.Row key={attr + 'env'}>
                        <Table.Cell>{attr}</Table.Cell>
                        <Table.Cell className="wrapText">{store.agent.env[attr]}</Table.Cell>
                    </Table.Row>)
            }
        }

        const compatibleconfigurations = (!store.agent.compatibleConfigurations || store.agent.compatibleConfigurations.length == 0) ? <NoAgentsFound msg={'No Configurations Found'}/> : store.agent.compatibleConfigurations.map((configuration) =>
            <List.Item key={configuration.name}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header><Link to={`/configurations/${configuration.name}`}><strong>{configuration.name}</strong></Link></List.Header>
                    <List.Description>{configuration.description}</List.Description>
                </List.Content>
            </List.Item>)

        let lastConnectedTimeStamp = new Date(store.agent.updatedAt)
        return (
            <Container>
                <Menu attached='top' tabular>
                    <Menu.Item name='agent_summary' active={this.state.activeItem === 'agent_summary'}
                        onClick={(e, data) => this.handleItemClick(e, data)}><Icon name="signal"/> Agent Summary</Menu.Item>
                    <Menu.Item name='agent_attributes' active={this.state.activeItem === 'agent_attributes'}
                        onClick={(e, data) => this.handleItemClick(e, data)}><Icon name="shutdown"/> Agent
                        Attributes</Menu.Item>
                    <Menu.Item name='agent_environment' active={this.state.activeItem === 'agent_environment'}
                        onClick={(e, data) => this.handleItemClick(e, data)}><Icon name="shield"/> Agent
                        Environment</Menu.Item>
                    <Menu.Item name='compatible_configurations' active={this.state.activeItem === 'compatible_configurations'}
                        onClick={(e, data) => this.handleItemClick(e, data)}><Icon name="checkmark"/> Compatible 
                        Configurations</Menu.Item>
                </Menu>

                <Segment attached='bottom'>
                    { this.state.activeItem === 'agent_summary' ? (
                        <div>
                            <Header as='h2' attached='top'>
                                <Icon name='plug'/>
                                <Header.Content>
                                    Status
                                </Header.Content>
                            </Header>
                            <Segment attached>
                                <List>
                                    <List.Item>
                                        <List.Content>
                                            <Header as='h4'>
                                                <Label color={store.agent.isConnected ? 'green' : 'red'}>
                                                    <Icon
                                                        name={store.agent.isConnected ? 'signal' : 'lightning'}/> {store.agent.isConnected ? 'Connected' : 'Disconnected.'} {store.agent.isConnected ? '' : (' Last Connected At ' + lastConnectedTimeStamp.toLocaleString())}
                                                </Label>
                                            </Header>
                                        </List.Content>
                                        <Header as='h4' floated='right'>
                                            <Popup
                                                trigger={<Icon name='question circle outline'/>}
                                                content='Current Connection Status Of The Agent'
                                                inverted
                                            />
                                        </Header>
                                    </List.Item>
                                    <List.Item>
                                        <List.Content>
                                            <Header as='h4'>
                                                <Label color={store.agent.isAuthorized ? 'green' : 'red'}>
                                                    <Icon
                                                        name={store.agent.isAuthorized ? 'shield' : 'ban'}/> {store.agent.isAuthorized ? 'Authorized' : 'Unauthorized '}
                                                </Label>
                                            </Header>
                                            <Header as='h4' floated='right'>
                                                <Checkbox toggle checked={store.agent.isAuthorized}
                                                    onChange={this.OnAgentAuthorizationChanged}/>
                                            </Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Content>
                                            <Header as='h4'>
                                                <Label color={store.agent.isEnabled ? 'green' : 'red'}>
                                                    <Icon
                                                        name={store.agent.isEnabled ? 'checkmark' : 'remove'}/> {store.agent.isEnabled ? 'Enabled' : 'Disabled'}
                                                </Label>
                                            </Header>
                                            <Header as='h4' floated='right'>
                                                <Checkbox toggle checked={store.agent.isEnabled}
                                                    onChange={this.OnAgentStatusChanged}/>
                                            </Header>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Segment>
                            <Header as='h2' attached='top'>
                                <Icon name='tag'/>
                                <Header.Content>
                                    Details
                                </Header.Content>
                            </Header>
                            <Table compact celled fixed stackable selectable attached>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Property</Table.HeaderCell>
                                        <Table.HeaderCell>Value</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>Agent Name</Table.Cell>
                                        <Table.Cell>{store.agent.name}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Description</Table.Cell>
                                        <Table.Cell>{store.agent.description}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>IP Address</Table.Cell>
                                        <Table.Cell>{store.agent.ipAddress}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Os</Table.Cell>
                                        <Table.Cell>{store.agent.os}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Version</Table.Cell>
                                        <Table.Cell>{store.agent.version}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </div>
                    ) : this.state.activeItem === 'agent_attributes' ? (
                        <Table compact celled fixed stackable selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Value</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                { attrs }
                            </Table.Body>
                        </Table>
                    ) : this.state.activeItem === 'agent_environment' ? (
                        <Table compact celled fixed stackable selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Value</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {env}
                            </Table.Body>
                        </Table>
                    ) : (
                        <List divided relaxed>
                            {compatibleconfigurations}
                        </List>) }
                </Segment>
            </Container>)
    }

}

Agent.propTypes = {
    store : PropTypes.shape({
        agent : PropTypes.object.isRequired   
    })
}

Agent.defaultProps = {
    store :{
        agent : {}
    }
}