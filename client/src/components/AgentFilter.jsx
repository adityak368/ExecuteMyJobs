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
export default class AgentFilter extends Component {

    state = { 'isEditVisible' : false,
        agentFilter : {k : '', v: ''}}

    componentDidMount() {
        
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
    onClickEditFilter(e, filter) {
        this.setState({isEditVisible:true})
        let agentFilter = this.state.agentFilter
        agentFilter.k = filter.k
        agentFilter.v =  filter.v
        this.setState({agentFilter})
    }

    @autobind
    onClickCancelEditFilter(e, data) {
        this.setState({isEditVisible:false})
        let agentFilter = {k : '', v: ''}
        this.setState({agentFilter})
    }

    render() {
        const {filter, index, onClickDeleteAgentFilter, onSubmitEditAgentFilter} = this.props
        return (
            <Step >
                {!this.state.isEditVisible ? (
                    <Step >
                        <Step.Content className='full-width'>
                            <Popup
                                trigger={<Button size='tiny' floated='right' color='red' icon='trash outline' onClick={(e)=> onClickDeleteAgentFilter(e, filter)} />}
                                content='Delete Filter'
                                inverted
                            /> 
                            <Popup
                                trigger={<Button size='tiny' floated='right' color='blue' icon='pencil' onClick={(e) => this.onClickEditFilter(e, filter)} />}
                                content='Edit Filter'
                                inverted
                            /> 
                            <Step.Title>{ filter.k + ' = '+ filter.v}</Step.Title>
                        </Step.Content>
                    </Step> ) : (
                    <Step.Content className='full-width'>
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
                            <Button onClick={() =>{this.setState({isEditVisible: false}); this.props.onSubmitEditAgentFilter(index,this.state.agentFilter) }} inverted color='green' size="small">Change Filter</Button>
                            <Button onClick={this.onClickCancelEditFilter} inverted color='red' size="small">Cancel</Button>
                        </Message>
                    </Step.Content>)}
            </Step>
        )
    }

}

AgentFilter.propTypes = {
    filter: PropTypes.object.isRequired,
    onClickDeleteAgentFilter: PropTypes.func.isRequired,
    onSubmitEditAgentFilter : PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
}

