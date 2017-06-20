import React, {Component} from 'react';
import axios from 'axios';
import {Menu, Segment, Container, Icon, Button, Header, Input, Message, Form} from 'semantic-ui-react';

export default class Configuration extends Component {

    constructor(props) {
        super(props);
        this.fetchConfigurationDetails = this.fetchConfigurationDetails.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.onSubmitWorkingDirChange = this.onSubmitWorkingDirChange.bind(this);
        this.onSubmitAddBuildStep = this.onSubmitAddBuildStep.bind(this);
        this.onSubmitCopyBuildStep = this.onSubmitCopyBuildStep.bind(this);
        this.onSubmitDeleteBuildStep = this.onSubmitDeleteBuildStep.bind(this);
        this.onChangeWorkingDir = this.onChangeWorkingDir.bind(this);
        this.onChangeBuildStep = this.onChangeBuildStep.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.state = {
            config: {},
            workingDir: '',
            buildStep: {command: '', arguments: '', commandDir: ''},
            activeItem: 'config_details'
        };
    }

    handleItemClick(e, {name}) {
        this.setState({activeItem: name});
    }

    fetchConfigurationDetails() {

        if (this.props.match.params.configurationName) {
            axios.get('/api/configurations/' + this.props.match.params.configurationName)
                .then((response) => {
                    this.setState({config: response.data});
                    if (response.data.workingDir) {
                        this.setState({workingDir: response.data.workingDir});
                    }
                })
                .catch((error) => {
                    toastr.error(error.response.data.message, 'Error!');
                });
        } else {
            toastr.error('Invalid Configuration!', 'Error!');
        }

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

    componentWillMount() {
        this.fetchConfigurationDetails();
    }

    handleChangeName(e) {
        this.setState({name: e.target.value});
    }

    handleChangeDescription(e) {
        this.setState({description: e.target.value});
    }

    onSubmitWorkingDirChange(e) {
        e.preventDefault();
        if (this.props.match.params.configurationName) {
            axios.put('/api/configurations/' + this.props.match.params.configurationName, {
                workingDir: this.state.workingDir,
            })
                .then((response) => {
                    toastr.success(response.data.message, 'Success!');
                })
                .catch((error) => {
                    toastr.error(error.response.data.message, 'Error!');
                });
        } else {
            toastr.error('Invalid Configuration!', 'Error!');
        }

    }

    onSubmitAddBuildStep(e) {
        e.preventDefault();
        if (this.props.match.params.configurationName) {
            axios.post('/api/buildsteps/' + this.props.match.params.configurationName, this.state.buildStep)
                .then((response) => {
                    toastr.success(response.data.message, 'Success!');
                })
                .catch((error) => {
                    toastr.error(error.response.data.message, 'Error!');
                });
        } else {
            toastr.error('Invalid Configuration!', 'Error!');
        }
    }

    onSubmitCopyBuildStep(e) {
        e.preventDefault();
        if (this.props.match.params.configurationName) {
            axios.put('/api/configurations/' + this.props.match.params.configurationName, {
                workingDir: this.state.workingDir,
            })
                .then((response) => {
                    toastr.success(response.data.message, 'Success!');
                })
                .catch((error) => {
                    toastr.error(error.response.data.message, 'Error!');
                });
        } else {
            toastr.error('Invalid Configuration!', 'Error!');
        }
    }

    onSubmitDeleteBuildStep(e) {
        e.preventDefault();
        if (this.props.match.params.configurationName) {
            axios.put('/api/configurations/' + this.props.match.params.configurationName, {
                workingDir: this.state.workingDir,
            })
                .then((response) => {
                    toastr.success(response.data.message, 'Success!');
                })
                .catch((error) => {
                    toastr.error(error.response.data.message, 'Error!');
                });
        } else {
            toastr.error('Invalid Configuration!', 'Error!');
        }

    }

    onChangeWorkingDir(e, data) {
        this.setState({workingDir: data.value});
    }

    onChangeBuildStep(data,id) {
        if (id === 'command') {
            let buildStep = this.state.buildStep;
            buildStep.command = data.value;
            this.setState({buildStep: buildStep});
        }
        if (id === 'args') {
            let buildStep = this.state.buildStep;
            buildStep.arguments = data.value;
            this.setState({buildStep: buildStep});
        }
        if (id === 'commandDir') {
            let buildStep = this.state.buildStep;
            buildStep.commandDir = data.value;
            this.setState({buildStep: buildStep});
        }
    }

    render() {
        const {activeItem} = this.state;
        return (
            <Container>
                <Menu attached='top' tabular>
                    <Menu.Item name='config_details' active={activeItem === 'config_details'}
                               onClick={this.handleItemClick}><Icon name="book"/>Configuration Details</Menu.Item>
                    <Menu.Item name='edit_buildsteps' active={activeItem === 'edit_buildsteps'}
                               onClick={this.handleItemClick}><Icon name="puzzle"/> Build Steps</Menu.Item>
                </Menu>

                <Segment attached='bottom'>
                    { activeItem === 'config_details' ? (
                        <Header as='h2'>
                            <Icon name='settings'/>
                            <Header.Content>
                                {this.state.config.name}
                                <Header.Subheader>
                                    {this.state.config.description}
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    ) : (
                        <div>
                            <Input fluid
                                   label='Set Working Directory' placeholder='Path to working directory in Agent'
                                   action={<Button onClick={this.onSubmitWorkingDirChange}><Icon
                                       name='folder'/></Button>}
                                   onChange={(e, data) => this.onChangeWorkingDir(e, data)}
                                   onKeyPress={this.onSubmitWorkingDirChange}/>
                            <Message>
                                <Form>
                                    <Form.Group widths='equal'>
                                        <Form.Field>
                                            <Input name="command"
                                                   value={this.state.buildStep.command}
                                                   required="true"
                                                   onChange={(e,data) => this.onChangeBuildStep(data,'command')} placeholder='Command'/>
                                        </Form.Field>
                                        <Form.Field>
                                            <Input name="args"
                                                   value={this.state.buildStep.arguments}
                                                   onChange={(e,data) =>this.onChangeBuildStep(data,'args')} placeholder='Arguments'/>
                                        </Form.Field>
                                        <Form.Field>
                                            <Input name="commandDir"
                                                   value={this.state.buildStep.commandDir}
                                                   onChange={(e,data) => this.onChangeBuildStep(data,'commandDir)')} placeholder='Execution directory of the command'/>
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                                <Button onClick={this.onSubmitAddBuildStep} inverted color='green' size="small">Add Build Step</Button>
                            </Message>
                        </div>
                    )}
                </Segment>
            </Container> );
    }

}



