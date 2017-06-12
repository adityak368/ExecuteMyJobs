import React, {Component} from 'react';
import axios from 'axios';
import Base from './Base';

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
        this.state = {config: {}, workingDir: '', buildStep: {command: '', arguments: '', commandDir: ''}};
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

    onChangeWorkingDir(e) {
        this.setState({workingDir: e.target.value});
    }

    onChangeBuildStep(e) {
        if (e.target.name === 'command') {
            let buildStep = this.state.buildStep;
            buildStep.command = e.target.value;
            this.setState({buildStep: buildStep});
        }
        if (e.target.name === 'args') {
            let buildStep = this.state.buildStep;
            buildStep.arguments = e.target.value;
            this.setState({buildStep: buildStep});
        }
        if (e.target.name === 'commandDir') {
            let buildStep = this.state.buildStep;
            buildStep.commandDir = e.target.value;
            this.setState({buildStep: buildStep});
        }
    }

    render() {
        return (
            <Base>
                <div className="container" style={{marginTop: "3rem"}}>
                    <div className="columns">
                        <div className="column">
                            <div id="tabs" className="tabs is-toggle is-fullwidth">
                                <ul>
                                    <li className="is-active" data-tab="config_details"><a >Configuration Details</a>
                                    </li>
                                    <li data-tab="edit_buildsteps"><a >Build Steps</a></li>
                                </ul>
                            </div>
                            <div id="config_details" className="tab-content is-active">
                                <section className="hero">
                                    <div className="hero-body">
                                        <div className="container">
                                            <h1 className="title">
                                                Configuration Name
                                            </h1>
                                            <h2 className="subtitle">
                                                {this.state.config.name}
                                            </h2>
                                        </div>
                                    </div>
                                </section>
                                <section className="hero">
                                    <div className="hero-body">
                                        <div className="container">
                                            <h1 className="title">
                                                Configuration Description
                                            </h1>
                                            <h2 className="subtitle">
                                                {this.state.config.description}
                                            </h2>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div id="edit_buildsteps" className="tab-content">
                                <form id="editWorkingDirectory"
                                      onSubmit={this.onSubmitWorkingDirChange}>
                                    <div className="field is-horizontal">
                                        <div className="field-label is-normal">
                                            <label className="label">Set Working Directory</label>
                                        </div>
                                        <div className="field has-addons field-body">
                                            <p className="control has-icons-left is-expanded">
                                                <input className="input" type="text" name="workingDir"
                                                       value={this.state.workingDir}
                                                       required="true" onChange={this.onChangeWorkingDir}
                                                       placeholder="Working Directory Path"/>
                                                <span className="icon is-small is-left">
                                                <i className="fa fa-user"></i>
                                            </span>
                                            </p>
                                            <p className="control">
                                                <button type="submit" className="button is-info">
                                                    Set
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </form>

                                <form id="addStepForm" onSubmit={this.onSubmitAddBuildStep}>
                                    <div className="box is-clearfix" style={{margin: "1rem"}}>
                                        <article className="media">
                                            <div className="media-content">
                                                <div className="content">
                                                    <div className="field is-horizontal">
                                                        <div className="field-label is-small">
                                                            <label className="label">Command</label>
                                                        </div>
                                                        <div className="field-body">
                                                            <div className="field">
                                                                <div className="control">
                                                                    <input className="input is-small" type="text"
                                                                           name="command"
                                                                           value={this.state.buildStep.command}
                                                                           required="true"
                                                                           onChange={this.onChangeBuildStep}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="field is-horizontal">
                                                        <div className="field-label is-small">
                                                            <label className="label">Arguments</label>
                                                        </div>
                                                        <div className="field-body">
                                                            <div className="field">
                                                                <div className="control">
                                                                    <input className="input is-small" type="text"
                                                                           name="args"
                                                                           value={this.state.buildStep.arguments}
                                                                           onChange={this.onChangeBuildStep}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="field is-horizontal">
                                                        <div className="field-label is-small">
                                                            <label className="label">Directory for the command
                                                                execution</label>
                                                        </div>
                                                        <div className="field-body">
                                                            <div className="field">
                                                                <div className="control">
                                                                    <input className="input is-small" type="text"
                                                                           name="commandDir"
                                                                           value={this.state.buildStep.commandDir}
                                                                           onChange={this.onChangeBuildStep}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                        <button className="button is-success is-outlined is-pulled-right" type="submit">
                                            Add Step
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Base>
        );
    }

}



