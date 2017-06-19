import React, {Component} from 'react';
import axios from 'axios';

export default class Agent extends Component {

    constructor(props) {
        super(props);
        this.fetchAgent = this.fetchAgent.bind(this);
        this.OnAgentAuthorizationChanged = this.OnAgentAuthorizationChanged.bind(this);
        this.OnAgentStatusChanged = this.OnAgentStatusChanged.bind(this);
        this.state = {agent: {}, isEnabled: true, isAuthorized: false};
    }

    fetchAgent() {
        if (this.props.match.params.agentName) {
            axios.get('/api/agents/' + this.props.match.params.agentName)
                .then((response) => {
                    this.setState({
                        agent: response.data,
                        isEnabled: response.data.isEnabled,
                        isAuthorized: response.data.isAuthorized
                    });
                })
                .catch((error) => {
                    toastr.error(error.response.data.message, 'Error!');
                });
        } else {
            toastr.error('Invalid AgentName!', 'Error!');
        }
    }

    componentWillMount() {
        this.fetchAgent();
    }

    componentDidMount() {
        $('.tabs ul li').click(function () {
            var tab_id = $(this).attr('data-tab');

            $('.tabs ul li').removeClass('is-active');
            $('.tab-content').removeClass('is-active');

            $(this).addClass('is-active');
            $("#" + tab_id).addClass('is-active');
        });
    }

    OnAgentAuthorizationChanged(e) {
        this.setState({isAuthorized: e.target.checked});
        if (this.props.params.agentName) {
            axios.put('/api/agents/' + this.props.match.params.agentName, {
                isAuthorized: e.target.checked
            })
                .catch((error) => {
                    toastr.error(error.response.data.message, 'Error!');
                });
        }
    }

    OnAgentStatusChanged(e) {
        this.setState({isEnabled: e.target.checked});
        if (this.props.params.agentName) {
            axios.put('/api/agents/' + this.props.match.params.agentName, {
                isEnabled: e.target.checked
            })
                .catch((error) => {
                    toastr.error(error.response.data.message, 'Error!');
                });
        }
    }

    render() {
        const attrs = [];
        for (var attr in this.state.agent.attributes) {
            if (this.state.agent.attributes.hasOwnProperty(attr)) {
                attrs.push(
                    <tr key={attr}>
                        <td style={{wordWrap: "break-word"}}> {attr}</td>
                        <td style={{wordWrap: "break-word"}}>{this.state.agent.attributes[attr]}</td>
                    </tr>);
            }
        }

        const env = [];
        for (var attr in this.state.agent.env) {
            if (this.state.agent.env.hasOwnProperty(attr)) {
                env.push(
                    <tr key={attr}>
                        <td style={{wordWrap: "break-word"}}>{attr}</td>
                        <td style={{wordWrap: "break-word"}}>{this.state.agent.env[attr]}</td>
                    </tr>);
            }
        }
        let lastConnectedTimeStamp = new Date(this.state.agent.updatedAt);
        return (
                <div className="container" style={{marginTop: "3rem"}}>
                    <div className="columns">
                        <div className="column">
                            <div id="tabs" className="tabs is-toggle is-fullwidth">
                                <ul>
                                    <li className="is-active" data-tab="agent_summary"><a>Agent Summary</a></li>
                                    <li data-tab="agent_attributes"><a>Agent Attributes</a></li>
                                    <li data-tab="agent_environment"><a>Agent Environment</a></li>
                                </ul>
                            </div>
                            <div id="agent_summary" className="tab-content is-active">
                                <table className="highlight bordered"
                                       style={{borderSpacing: "15px", borderCollapse: "inherit"}}>
                                    <tbody>
                                    <tr>
                                        <td className="center-align">
                                            <strong>Status</strong>
                                        </td>
                                        <td>
                                            <table style={{borderSpacing: "15px", borderCollapse: "inherit"}}>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <strong><span
                                                            style={{color: this.state.agent.isConnected ? 'green' : 'red'}}>{this.state.agent.isConnected ? 'Connected' : 'Disconnected. '}</span>
                                                            {this.state.agent.isConnected ? '' : ('Last Connected At ' + lastConnectedTimeStamp.toLocaleString())}
                                                        </strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{width: "30%"}}>
                                                        <strong><p
                                                            style={{color: this.state.isAuthorized ? 'green' : 'red'}}>{this.state.isAuthorized ? 'Authorized' : 'Unauthorized'}</p>
                                                        </strong>
                                                    </td>
                                                    <td style={{width: "70%"}}>
                                                        <div className="field">
                                                            <p className="control">
                                                                <label className="checkbox">
                                                                    <input type="checkbox"
                                                                           checked={this.state.isAuthorized}
                                                                           style={{marginRight: "1rem"}}
                                                                           onChange={this.OnAgentAuthorizationChanged}/>
                                                                    Authorize
                                                                </label>
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <strong><p
                                                            style={{color: this.state.isEnabled ? 'green' : 'red'}}>{this.state.isEnabled ? 'Enabled' : 'Disabled'}</p>
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <div className="field">
                                                            <p className="control">
                                                                <label className="checkbox">
                                                                    <input type="checkbox"
                                                                           checked={ this.state.isEnabled }
                                                                           style={{marginRight: "1rem"}}
                                                                           onChange={this.OnAgentStatusChanged}/>
                                                                    Enabled
                                                                </label>
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="center-align">
                                            <strong>Details</strong>
                                        </td>
                                        <td>
                                            <table style={{borderSpacing: "15px", borderCollapse: "inherit"}}>
                                                <tbody>
                                                <tr>
                                                    <td style={{width: "30%"}}>
                                                        <strong>Agent Name :</strong></td>
                                                    <td style={{width: "70%"}}>{this.state.agent.name}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <strong>Description :</strong></td>
                                                    <td>{this.state.agent.description}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <strong>IP Address :</strong></td>
                                                    <td>{this.state.agent.ipAddress}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <strong>Os :</strong></td>
                                                    <td>{this.state.agent.os}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <strong>Version :</strong></td>
                                                    <td>{this.state.agent.version}
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="agent_attributes" className="tab-content">
                                <table className="table is-striped" style={{tableLayout: "fixed", width: "100%"}}>
                                    <thead>
                                    <tr>
                                        <th style={{wordWrap: "break-word", width: "30%"}}>Attribute</th>
                                        <th style={{wordWrap: "break-word", width: "70%"}}>Value</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {attrs}
                                    </tbody>
                                </table>
                            </div>
                            <div id="agent_environment" className="tab-content">
                                <table className="table is-striped" style={{tableLayout: "fixed", width: "100%"}}>
                                    <thead>
                                    <tr>
                                        <th style={{wordWrap: "break-word", width: "30%"}}>Attribute</th>
                                        <th style={{wordWrap: "break-word", width: "70%"}}>Value</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {env}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>)
            ;
    }

}
