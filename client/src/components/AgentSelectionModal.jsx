import React, {Component} from 'react'
import { handleError } from 'commons/errorhandler'
import { fetchCompatibleAgents, submitJob } from 'api/api'
import { Container, Modal, Button, Form, Radio} from 'semantic-ui-react'

import {observer, PropTypes as MobxPropTypes} from 'mobx-react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

@observer
export default class AgentSelectionModal extends Component {

    state = {
        selectedAgent : ''
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.open)
            this.fetchCompatibleAgents()
    }

    @autobind
    fetchCompatibleAgents() {
        const store = this.props.store
        fetchCompatibleAgents (this.props.configuration.name)
            .then((agents) => { store.agents = agents })
            .catch((error) => handleError(error))
    }

    @autobind
    onSubmitJob() {
        this.props.onCloseAgentSelectionModal() 
        if (this.props.configuration.name) {
            if(!this.props.isBuildStepAdded) {
                toastr.error('Please Add a Build Step!', 'Error!')
                return
            }
            
            if(this.state.selectedAgent.trim()) {
                submitJob({configuration : this.props.configuration, agent : this.state.selectedAgent})
                    .then((message) =>{ this.setState({ selectedAgent : ''}); toastr.success(message, 'Success!')})
                    .catch((error) => handleError(error))
            } else {
                toastr.error('Please Select an Agent!', 'Error!')
            }
        } else {
            toastr.error('Invalid Configuration!', 'Error!')
        }
    }

    @autobind
    handleChangedAgent(e, { value }) {
        this.setState({selectedAgent:value})
    }

    render() {
        const store = this.props.store
        const agents = store.agents.map((agent)=> <Form.Field control={Radio} label={agent.name} value={agent.name} key={agent.name} checked={this.state.selectedAgent===agent.name}  onChange={this.handleChangedAgent} />)
        return (
            <Container>
                <Modal
                    open={this.props.open}
                    closeOnRootNodeClick={true}
                    onClose={this.props.onCloseAgentSelectionModal}
                >
                    <Modal.Header>
                        Select Agent
                    </Modal.Header>
                    <Modal.Content>
                        <p>Please Select an Agent to Build</p>
                        <Form>
                            <Form.Group grouped>
                                {agents}
                            </Form.Group>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.props.onCloseAgentSelectionModal} content='Cancel'/>
                        <Button positive labelPosition='right' icon='checkmark' content='Ok' onClick={this.onSubmitJob} />
                    </Modal.Actions>
                </Modal>
            </Container>
        )
    }

}

AgentSelectionModal.propTypes = {
    store : PropTypes.shape({
        compatibleAgents: MobxPropTypes.observableArray.isRequired,
    }),
    open : PropTypes.bool.isRequired,
    onCloseAgentSelectionModal : PropTypes.func.isRequired,
    configuration : PropTypes.object.isRequired,
    isBuildStepAdded : PropTypes.bool.isRequired
}

AgentSelectionModal.defaultProps = {
    store :{
        compatibleAgents: []
    },
    open : false,
    onCloseAgentSelectionModal : null,
    configuration: {},
    isBuildStepAdded : PropTypes.bool.isRequired
}

