import React, {Component} from 'react';
import {Header, Segment, Icon, List, Label, Checkbox, Container, Menu, Popup, Table} from 'semantic-ui-react';
import {fetchAgent, changeAgentAuthorization, changeAgentEnabled} from 'api/api';
import {handleError} from 'commons/errorhandler';

export default class Agent extends Component {

    constructor(props) {
        super(props);
        this.OnAgentAuthorizationChanged = this.OnAgentAuthorizationChanged.bind(this);
        this.OnAgentStatusChanged = this.OnAgentStatusChanged.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.state = {agent: {}, activeItem: 'agent_summary'};
    }

    handleItemClick(e, {name}) {
        this.setState({activeItem: name});
    }

    componentDidMount() {
        fetchAgent('/api/agents/' + this.props.match.params.agentName)
            .then((agent) => this.setState({agent}))
            .catch((error) => handleError(error));
    }

    OnAgentAuthorizationChanged(e, data) {
        let agent = this.state.agent;
        agent.isAuthorized = data.checked;
        this.setState({agent});
        changeAgentAuthorization('/api/agents/' + this.props.match.params.agentName, {
            isAuthorized: data.checked
        }).catch((error) => handleError(error));
    }

    OnAgentStatusChanged(e, data) {

        let agent = this.state.agent;
        agent.isEnabled = data.checked;
        this.setState({agent});
        changeAgentEnabled('/api/agents/' + this.props.match.params.agentName, {
            isEnabled: data.checked
        }).catch((error) => handleError(error));
    }

    render() {
        const attrs = [];
        for (var attr in this.state.agent.attributes) {
            if (this.state.agent.attributes.hasOwnProperty(attr)) {
                attrs.push(
                    <Table.Row key={attr + 'prop'}>
                        <Table.Cell> {attr}</Table.Cell>
                        <Table.Cell className="wrapText">{this.state.agent.attributes[attr]}</Table.Cell>
                    </Table.Row>);
            }
        }

        const env = [];
        for (var attr in this.state.agent.env) {
            if (this.state.agent.env.hasOwnProperty(attr)) {
                env.push(
                    <Table.Row key={attr + 'env'}>
                        <Table.Cell>{attr}</Table.Cell>
                        <Table.Cell className="wrapText">{this.state.agent.env[attr]}</Table.Cell>
                    </Table.Row>);
            }
        }


        let lastConnectedTimeStamp = new Date(this.state.agent.updatedAt);
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
                                                <Label color={this.state.agent.isConnected ? 'green' : 'red'}>
                                                    <Icon
                                                        name={this.state.agent.isConnected ? 'signal' : 'lightning'}/> {this.state.agent.isConnected ? 'Connected' : 'Disconnected.'} {this.state.agent.isConnected ? '' : (' Last Connected At ' + lastConnectedTimeStamp.toLocaleString())}
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
                                                <Label color={this.state.agent.isAuthorized ? 'green' : 'red'}>
                                                    <Icon
                                                        name={this.state.agent.isAuthorized ? 'shield' : 'ban'}/> {this.state.agent.isAuthorized ? 'Authorized' : 'Unauthorized '}
                                                </Label>
                                            </Header>
                                            <Header as='h4' floated='right'>
                                                <Checkbox toggle checked={this.state.agent.isAuthorized}
                                                          onChange={this.OnAgentAuthorizationChanged}/>
                                            </Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Content>
                                            <Header as='h4'>
                                                <Label color={this.state.agent.isEnabled ? 'green' : 'red'}>
                                                    <Icon
                                                        name={this.state.agent.isEnabled ? 'checkmark' : 'remove'}/> {this.state.agent.isEnabled ? 'Enabled' : 'Disabled'}
                                                </Label>
                                            </Header>
                                            <Header as='h4' floated='right'>
                                                <Checkbox toggle checked={this.state.agent.isEnabled}
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
                                        <Table.Cell>{this.state.agent.name}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Description</Table.Cell>
                                        <Table.Cell>{this.state.agent.description}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>IP Address</Table.Cell>
                                        <Table.Cell>{this.state.agent.ipAddress}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Os</Table.Cell>
                                        <Table.Cell>{this.state.agent.os}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Version</Table.Cell>
                                        <Table.Cell>{this.state.agent.version}</Table.Cell>
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
                    ) : (
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
                    ) }
                </Segment>
            </Container>);
    }

}
