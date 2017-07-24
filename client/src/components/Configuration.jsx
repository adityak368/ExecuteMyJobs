import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Menu, Segment, Container, Icon, Button, Header, Input, Message, Form, Step, Popup, Modal, List} from 'semantic-ui-react'
import { handleError } from 'commons/errorhandler'
import { fetchConfiguration, updateConfiguration, addBuildStep, removeBuildStep, submitJob, addAgentFilter, removeAgentFilter, fetchCompatibleAgents, updateBuildStep } from 'api/api'
import AgentSelectionModal from 'components/AgentSelectionModal'
import NoAgentsFound from 'components/NotFound'

import CompatibleAgentsStore from 'stores/CompatibleAgentsStore'

import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import {observer} from 'mobx-react'

//drag and drop functionality for build steps
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'

import BuildStep from 'components/BuildStep'
import AgentFilter from 'components/AgentFilter'

const BuildStepSortable = SortableElement((props) => <BuildStep {...props} />)

const BuildStepList = SortableContainer(({steps,onClickDeleteStep, onSubmitEditBuildStep}) => 
    <Step.Group vertical fluid>
        {steps?steps.map((step, index) => (
            <BuildStepSortable key={`buildStep${index}`} index={index} step={step} sortIndex={index} onClickDeleteStep={onClickDeleteStep} onSubmitEditBuildStep={onSubmitEditBuildStep}/>
        )):null}
    </Step.Group>
)

const AgentFilterList = ({agentFilter,onClickDeleteAgentFilter, onSubmitEditAgentFilter}) => 
    <Step.Group vertical fluid>
        {agentFilter?agentFilter.map((filter, index) => (
            <AgentFilter key={`agentFilter${index}`} index={index} filter={filter} onClickDeleteAgentFilter={onClickDeleteAgentFilter} onSubmitEditAgentFilter={onSubmitEditAgentFilter}/>
        )):null}
    </Step.Group>



@observer
class Configuration extends Component {

    state = {
        buildStep: {command: '', arguments: '', commandDir: ''},
        agentFilter : {k : '', v: ''},
        activeItem: 'config_details'
    }

    @autobind
    handleItemClick(e, {name}) {
        this.setState({activeItem: name})
        if(name==='compatible_agents') {
            const {store} = this.props
            fetchCompatibleAgents(this.props.match.params.configurationName)
                .then((compatibleAgents) => { 
                    store.compatibleAgents = compatibleAgents
                }).catch((error) => handleError(error))
        }
    }

    @autobind
    fetchConfigurationDetails() {
        const {store} = this.props
        if (this.props.match.params.configurationName) {

            fetchConfiguration(this.props.match.params.configurationName)
                .then((configuration) => { 
                    store.configuration = configuration
                    let buildStep = this.state.buildStep
                    buildStep.commandDir = configuration.workingDir
                    this.setState({buildStep}) 
                }).catch((error) => handleError(error))

        } else {
            toastr.error('Invalid Configuration!', 'Error!')
        }

    }

    componentDidMount() {
        this.fetchConfigurationDetails()
    }

    @autobind
    onSubmitWorkingDirChange(e) {
        const {store} = this.props
        if (this.props.match.params.configurationName) {
            updateConfiguration(this.props.match.params.configurationName, {
                workingDir: store.configuration.workingDir,
            }).then((message) => {
                let buildStep = this.state.buildStep
                buildStep.commandDir = store.configuration.workingDir
                this.setState({buildStep}) 
                toastr.success(message, 'Success!')
            }).catch((error) => handleError(error))

        } else {
            toastr.error('Invalid Configuration!', 'Error!')
        }

    }

    @autobind
    onSubmitAddBuildStep(e) {
        e.preventDefault()
        const {store} = this.props
        if (this.props.match.params.configurationName) {
            if(!this.state.buildStep.command.trim() || !this.state.buildStep.commandDir.trim()) {
                toastr.error('Please Add all the required details (Command and Command Directory) for the Build Step!', 'Error!')
                return
            }
            addBuildStep(this.props.match.params.configurationName, this.state.buildStep)
                .then((message) => { 
                    this.fetchConfigurationDetails()
                    let buildStep = {command: '', arguments: '', commandDir: store.configuration.workingDir}
                    this.setState({buildStep})
                    toastr.success(message, 'Success!') 
                }).catch((error) => handleError(error))
        } else {
            toastr.error('Invalid Configuration!', 'Error!')
        }
    }

    @autobind
    onSubmitAddAgentFilter(e) {
        e.preventDefault()
        if (this.props.match.params.configurationName) {
            if(this.state.agentFilter.k.trim() && this.state.agentFilter.v.trim()) {
                addAgentFilter(this.props.match.params.configurationName, this.state.agentFilter)
                    .then((message) => { 
                        this.fetchConfigurationDetails()
                        let agentFilter = {k: '', v: ''}
                        this.setState({agentFilter})
                        toastr.success(message, 'Success!') 
                    }).catch((error) => handleError(error))
            }
            else
                toastr.error('Both fields are required', 'Error!') 
        } else {
            toastr.error('Invalid Configuration!', 'Error!')
        }
    }
    
    @autobind
    onClickDeleteAgentFilter(e,filterToBeDeleted) {
        e.preventDefault()
        this.setState({open: true, modalTitle : 'Delete Filter', modalMessage: 'Are you sure you want to delete this filter?', filterToBeDeleted})
    }

    @autobind
    onClickDeleteStep(e,stepid) {
        e.preventDefault()
        this.setState({open: true, stepToBeDeleted : stepid, modalTitle : 'Delete Step', modalMessage: 'Are you sure you want to delete this step?'})
    }

    @autobind
    onChangeWorkingDir(e, data) {
        this.props.store.configuration.workingDir = data.value
    }

    @autobind
    onChangeBuildStep(data,id) {

        if (id === 'command') {
            let buildStep = this.state.buildStep
            buildStep.command = data.value
            this.setState({buildStep: buildStep})
        }
        if (id === 'args') {
            let buildStep = this.state.buildStep
            buildStep.arguments = data.value
            this.setState({buildStep})
        }
        if (id === 'commandDir') {
            let buildStep = this.state.buildStep
            buildStep.commandDir = data.value
            this.setState({buildStep})
        }
    }

    @autobind
    onChangeAgentFilter(data,id) {

        if (id === 'agentAttribute') {
            let agentFilter = this.state.agentFilter
            agentFilter.k = data.value
            this.setState({agentFilter})
        }
        if (id === 'agentAttributeValue') {
            let agentFilter = this.state.agentFilter
            agentFilter.v = data.value
            this.setState({agentFilter})
        }
    }

    @autobind
    onConfirmDeleteStep() {
        const {store} = this.props
        if (this.props.match.params.configurationName) {
            removeBuildStep(this.props.match.params.configurationName, this.state.stepToBeDeleted)
                .then((message) => {
                    store.configuration.buildSteps.splice(store.configuration.buildSteps.findIndex(x => x._id == this.state.stepToBeDeleted), 1)
                    this.closeModal()
                    toastr.success(message, 'Success!')
                }).catch((error) => handleError(error))
        } else {
            toastr.error('Invalid Configuration!', 'Error!')
        }
    }

    @autobind
    onConfirmDeleteAgentFilter() {
        const {store} = this.props
        if (this.props.match.params.configurationName) {
            removeAgentFilter(this.props.match.params.configurationName, { params : this.state.filterToBeDeleted } )
                .then((message) => {
                    store.configuration.agentFilter.splice(store.configuration.agentFilter.findIndex(x => JSON.stringify(x) === JSON.stringify(this.state.filterToBeDeleted)), 1)
                    this.closeModal()
                    toastr.success(message, 'Success!')
                }).catch((error) => handleError(error))
        } else {
            toastr.error('Invalid Configuration!', 'Error!')
        }
    }

    @autobind
    closeModal () {
        this.setState({ open: false, stepToBeDeleted: '', filterToBeDeleted : null, modalTitle: '', modalMessage: ''})
    }

    @autobind
    onSortEnd ({oldIndex, newIndex}) {
        const {store} = this.props
        store.configuration.buildSteps = arrayMove(store.configuration.buildSteps,oldIndex,newIndex)
        updateConfiguration(this.props.match.params.configurationName, {
            buildSteps: store.configuration.buildSteps,
        }).catch((error) => handleError(error))
    };

    @autobind
    onClickSubmitJob() {
        this.setState({openAgentSelection : true})
    }

    @autobind
    onCloseAgentSelectionModal() {
        this.setState({openAgentSelection : false})
    }

    @autobind
    onSubmitEditAgentFilter(filterIndex,filter) {
        const {store} = this.props
        if(!this.state.agentFilter.k.trim() || !this.state.agentFilter.v.trim()) {
            toastr.error('Both fields are required', 'Error!') 
        }
        store.configuration.agentFilter[filterIndex] = filter
        updateConfiguration(this.props.match.params.configurationName, {
            agentFilter : store.configuration.agentFilter
        }).then((message)=> this.fetchConfigurationDetails())
            .catch((error) => handleError(error))
    }

    @autobind
    onSubmitEditBuildStep(stepIndex,buildStep) {
        const {store} = this.props
        if(!this.state.buildStep.command.trim() || !this.state.buildStep.commandDir.trim()) {
            toastr.error('Please Add all the required details (Command and Command Directory) for the Build Step!', 'Error!')
            return
        }
        store.configuration.buildSteps[stepIndex] = buildStep
        const stepId = buildStep._id
        delete buildStep._id
        updateBuildStep(this.props.match.params.configurationName, stepId, buildStep)
            .then((message)=> this.fetchConfigurationDetails())
            .catch((error) => handleError(error))
    }

    render() {
        const {activeItem} = this.state
        const {store} = this.props

        const compatibleAgents = (!store.compatibleAgents || store.compatibleAgents.length == 0) ? <NoAgentsFound msg={'No Compatible Agents Found'}/> : store.compatibleAgents.map((agent) =>
            <List.Item key={agent.name}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header><Link to={`/agents/${agent.name}`}><strong>{agent.name}</strong></Link></List.Header>
                    <List.Description>{agent.description}</List.Description>
                </List.Content>
            </List.Item>)

        return (

            <Container>
                <Menu attached='top' tabular>
                    <Menu.Item name='config_details' active={activeItem === 'config_details'}
                        onClick={this.handleItemClick}><Icon name="book"/>Configuration Details</Menu.Item>
                    <Menu.Item name='edit_buildsteps' active={activeItem === 'edit_buildsteps'}
                        onClick={this.handleItemClick}><Icon name="puzzle"/> Build Steps</Menu.Item>
                    <Menu.Item name='compatible_agents' active={activeItem === 'compatible_agents'}
                        onClick={this.handleItemClick}><Icon name="checkmark"/> Compatible Agents</Menu.Item>
                </Menu>

                <Segment attached='bottom'>
                    { activeItem === 'config_details' ? (
                        <div>
                            <Header as='h2'>
                                <Icon name='settings'/>
                                <Header.Content>
                                    {store.configuration.name}
                                    <Header.Subheader>
                                        {store.configuration.description}
                                    </Header.Subheader>
                                </Header.Content>
                            </Header>
                            <Header as='h4' floated='left'>
                                Agent Filters
                            </Header>
                            <Header floated='right'>
                                <Button onClick={this.onClickSubmitJob} inverted color='green' size="small" floated='right' icon='space shuttle' content='Submit Job' />
                            </Header>
                            <AgentFilterList agentFilter={store.configuration.agentFilter} onClickDeleteAgentFilter={this.onClickDeleteAgentFilter} onSubmitEditAgentFilter={this.onSubmitEditAgentFilter}/>
                            <Message>
                                <Form>
                                    <Form.Group widths='equal'>
                                        <Form.Field required>
                                            <Input name="agentAttribute"
                                                value={this.state.agentFilter.k}
                                                onChange={(e,data) => this.onChangeAgentFilter(data,'agentAttribute')} placeholder='Agent Attribute' required/>
                                        </Form.Field>
                                        <Form.Field required>
                                            <Input name="agentAttributeValue"
                                                value={this.state.agentFilter.v}
                                                onChange={(e,data) =>this.onChangeAgentFilter(data,'agentAttributeValue')} placeholder='Agent Attribute Value' required/>
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                                <Button onClick={this.onSubmitAddAgentFilter} inverted color='green' size="small">Add Filter</Button>
                            </Message>
                        </div>
                    ) : activeItem === 'edit_buildsteps' ? (
                        <div>
                            <Input fluid
                                label='Set Working Directory' placeholder='Path to working directory in Agent'
                                action={<Button onClick={this.onSubmitWorkingDirChange} icon='folder' />}
                                onChange={(e, data) => this.onChangeWorkingDir(e, data)}
                                value={store.configuration.workingDir} />
                            <BuildStepList steps={store.configuration.buildSteps} onSortEnd={this.onSortEnd} onClickDeleteStep={this.onClickDeleteStep} onSubmitEditBuildStep={this.onSubmitEditBuildStep} />
                            <Message>
                                <Form>
                                    <Form.Group widths='equal'>
                                        <Form.Field required>
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
                                        <Form.Field required>
                                            <Input name="commandDir"
                                                value={this.state.buildStep.commandDir}
                                                onChange={(e,data) => this.onChangeBuildStep(data,'commandDir')} placeholder='Execution directory of the command'/>
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                                <Button onClick={this.onSubmitAddBuildStep} inverted color='green' size="small">Add Build Step</Button>
                            </Message>
                        </div>
                    ) : (
                        <List divided relaxed>
                            {compatibleAgents}
                        </List>
                    )}
                </Segment>

                <Modal
                    open={this.state.open}
                    closeOnRootNodeClick={true}
                    onClose={this.closeModal}
                >
                    <Modal.Header>
                        {this.state.modalTitle}
                    </Modal.Header>
                    <Modal.Content>
                        <p>{this.state.modalMessage}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.closeModal}>No</Button>
                        <Button positive labelPosition='right' icon='checkmark' content='Yes' onClick={this.state.filterToBeDeleted?this.onConfirmDeleteAgentFilter : this.onConfirmDeleteStep} />
                    </Modal.Actions>
                </Modal>

                <AgentSelectionModal isBuildStepAdded={(store.configuration.buildSteps && store.configuration.buildSteps.length>0)?true:false} store={CompatibleAgentsStore} open={this.state.openAgentSelection} onCloseAgentSelectionModal={this.onCloseAgentSelectionModal} configuration={store.configuration}/>
            </Container> )
    }

}

Configuration.propTypes = {
    store : PropTypes.shape({
        configuration: PropTypes.object.isRequired
    })
}

Configuration.defaultProps = {
    store : {
        configuration : {}
    }
}

export default Configuration