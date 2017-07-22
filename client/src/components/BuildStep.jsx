import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import TreeView from 'components/TreeView'
import { handleError } from 'commons/errorhandler'
import { fetchProjects} from 'api/api'
import { Step, Popup, Button, Message, Form, Input} from 'semantic-ui-react'

import {observer, PropTypes as MobxPropTypes} from 'mobx-react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

@observer
export default class BuildStep extends Component {

    state = { 'isEditVisible' : false,
        buildStep: {command: '', arguments: '', commandDir: ''}}

    componentDidMount() {
        
    }

    @autobind
    onClickEditStep(e, step) {
        this.setState({isEditVisible:true})
        let buildStep = this.state.buildStep
        buildStep.command = step.command
        buildStep.arguments =  step.arguments
        buildStep.commandDir = step.commandDir
        this.setState({buildStep})
    }

    @autobind
    onClickCancelEditStep(e, stepId) {
        this.setState({isEditVisible:false})
        let buildStep = {command: '', arguments: '', commandDir: ''}
        this.setState({buildStep})
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

    render() {
        const {step, sortIndex, onClickDeleteStep} = this.props
        return (
            <Step >
                {!this.state.isEditVisible ? (
                    <Step.Content className='full-width'>
                        <Popup
                            trigger={<Button size='tiny' floated='right' color='red' icon='trash outline' onClick={(e)=> onClickDeleteStep(e, step._id)} />}
                            content='Delete Step'
                            inverted
                        /> 
                        <Popup
                            trigger={<Button size='tiny' floated='right' color='blue' icon='pencil' onClick={(e) => this.onClickEditStep(e, step)} />}
                            content='Edit Step'
                            inverted
                        /> 
                        <Step.Title>Step {sortIndex+1} </Step.Title>
                        <Step.Description> {'"' + step.command + ' '+ step.arguments + '" in '+step.commandDir} </Step.Description>
                    </Step.Content> ) : (
                    <Step.Content className='full-width'>
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
                                            onChange={(e,data) => this.onChangeBuildStep(data,'commandDir')} placeholder='Execution directory of the command'/>
                                    </Form.Field>
                                </Form.Group>
                            </Form>
                            <Button onClick={() =>{this.setState({isEditVisible: false}); this.props.onSubmitEditBuildStep(sortIndex,{...this.state.buildStep, _id : step._id }) }} inverted color='green' size="small">Change Step</Button>
                            <Button onClick={this.onClickCancelEditStep} inverted color='red' size="small">Cancel</Button>
                        </Message>
                    </Step.Content>)}
            </Step>
        )
    }

}

BuildStep.propTypes = {
    step: PropTypes.object.isRequired,
    onClickDeleteStep: PropTypes.func.isRequired,
    onSubmitEditBuildStep : PropTypes.func.isRequired,
    sortIndex: PropTypes.number.isRequired
}

