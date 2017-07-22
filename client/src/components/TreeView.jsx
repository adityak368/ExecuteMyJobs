import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Container, Icon,Accordion,Message, Header, Button, Label, Popup,Segment,Modal,List } from 'semantic-ui-react'
import NotFound from 'components/NotFound'
import { handleError } from 'commons/errorhandler'
import { deleteProject, deleteConfiguration } from 'api/api'

import {PropTypes as MobxPropTypes} from 'mobx-react'
import autobind from 'autobind-decorator'

export default class TreeView extends Component {

    state = { open: false, projectToBeDeleted : '', configToBeDeleted : '', modalMessage: '', modalTitle : '' }
    
    @autobind
    handleCreateConfiguration(projectName) {
        this.props.history.push(`/createconfiguration?project=${projectName}`)
    }
    
    @autobind
    handleDeleteProject(projectName) {
        this.setState({open : true, projectToBeDeleted:projectName, modalTitle: 'Delete Project', modalMessage : 'Are you sure you want to delete this project?. All Configurations of this project will also be deleted' })
    }

    @autobind
    handleDeleteConfiguration(configName) {
        this.setState({open : true, configToBeDeleted:configName, modalTitle: 'Delete Configuration', modalMessage : 'Are you sure you want to delete this configuration?' })
    }

    @autobind
    onConfirmDeleteConfiguration() {
        let configToBeDeleted = this.state.configToBeDeleted
        this.closeModal()
        deleteConfiguration (configToBeDeleted)
            .then((message) => {
                toastr.success(`Deleted Configuration ${configToBeDeleted}`, 'Success!')
                this.props.loadProjects()
            }).catch((error) => handleError(error))
    }

    @autobind
    onConfirmDeleteProject() {
        let projectToBeDeleted = this.state.projectToBeDeleted
        this.closeModal()
        deleteProject (projectToBeDeleted)
            .then((message) => {
                toastr.success(`Deleted Project ${projectToBeDeleted}`, 'Success!')
                this.props.loadProjects()
            }).catch((error) => handleError(error))
    }
        
    @autobind
    closeModal () {
        this.setState({ open: false, projectToBeDeleted: '', configToBeDeleted : '', modalMessage: '', modalTitle : '' })
    }

    render() {
        const projects = this.props.projects.map((project) => {
            const configurations = project.configurations.map( (config) => {

                return <List.Item key={config._id}>
                    <List.Content floated='right'>
                        <Popup
                            trigger={<Button size='tiny' color='red' icon='trash outline' onClick={() => this.handleDeleteConfiguration(config.name)}/>}
                            content='Delete Configuration'
                            inverted
                        />
                    </List.Content>
                    <List.Content>
                        <List.Header><Link to={`configurations/${config.name}`}> {config.name} </Link></List.Header>
                        <List.Description>{config.description}</List.Description>
                    </List.Content>
                </List.Item>
            })

            return ({
                key: project._id,
                title:<Label color='blue' content={ project.name }/>,
                content: (
                    <div>
                        <Segment clearing>
                            <Header as='h2' floated='left'>
                                <Icon name='cube'/>
                                <Header.Content>
                                    { project.name }
                                    <Header.Subheader>
                                        {project.description}
                                    </Header.Subheader>
                                </Header.Content>
                            </Header>
                            <Header  as='h2' floated='right'>
                                <Button.Group icon floated='right'>
                                    <Popup
                                        trigger={<Button size='tiny' color='green' icon='add' onClick={() => this.handleCreateConfiguration(project.name)} />}
                                        content='Add a new configuration'
                                        inverted
                                    /><Popup
                                        trigger={<Button size='tiny' color='red' icon='trash outline' onClick={() => this.handleDeleteProject(project.name)}/>}
                                        content='Delete project'
                                        inverted
                                    />     
                                </Button.Group>
                            </Header>
                        </Segment>

                        { project.configurations.length ? <div className="margin-1rem">
                            <Header>Configurations</Header>
                            <List>
                                {configurations}
                            </List>
                        </div> :  <NotFound msg="No Configurations Added!" isCenterOfPage={false}/> }
                    </div>
                ),
            })
        })
        return (

            <Container>

                {this.props.projects.length ? <Accordion panels={projects} exclusive={false} fluid styled/> : <NotFound msg="No Projects Added!"/>}

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
                        <Button positive labelPosition='right' icon='checkmark' content='Yes' onClick={this.state.projectToBeDeleted? this.onConfirmDeleteProject: this.onConfirmDeleteConfiguration} />
                    </Modal.Actions>
                </Modal>
            </Container>

        )
    }
}

TreeView.propTypes = {
    projects: MobxPropTypes.observableArray.isRequired
}

TreeView.defaultProps = {
    projects : []
}
