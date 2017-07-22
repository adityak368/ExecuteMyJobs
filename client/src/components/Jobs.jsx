import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import { handleError } from 'commons/errorhandler'
import { fetchJobs,requeueJob,deleteJob} from 'api/api'
import { Container, Menu, Label, Grid, Header, Icon, Button, Popup, Checkbox, Divider, Confirm} from 'semantic-ui-react'

import {observer, PropTypes as MobxPropTypes} from 'mobx-react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

@observer
export default class Jobs extends Component {

    state = { activeItem: 'All Jobs', filterable : false }

    columns = [
        {
            id: 'jobStatus', 
            Header: 'Status',
            accessor: job => {
                if(job.running) {
                    return 'Running'
                } else if(job.scheduled) {
                    return 'Scheduled'
                } else if(job.queued) {
                    return 'Queued'
                } else if(job.completed) {
                    return 'Completed'
                } else if(job.failed) {
                    return 'Failed'
                } else if(job.repeating) {
                    return 'Repeating'
                }
            },
            Cell: props => {
                if(props.original.running) {
                    return <Label color='yellow'>{props.value}</Label>
                } else if(props.original.scheduled) {
                    return <Label color='teal'>{props.value}</Label>
                } else if(props.original.queued) {
                    return <Label color='blue'>{props.value}</Label>
                } else if(props.original.completed) {
                    return <Label color='green'>{props.value}</Label>
                } else if(props.original.failed) {
                    return <Label color='red'>{props.value}</Label>
                } else if(props.original.repeating) {
                    return <Label color='purple'>{props.value}</Label>
                }
                return 
            }
        }, {
            Header: 'Name',
            accessor: 'job.data.type',
            Cell : (props) => <Link to={`/jobs/${props.original._id}`}>
                {props.value}
            </Link>
        }, {
            Header: 'Last Run Started At',
            accessor: 'job.lastRunAt',
            Cell : (props) => props.value? new Date(props.value).toLocaleString() : ''
        }, {
            Header: 'Next Run Starts At',
            accessor: 'job.nextRunAt',
            Cell : (props) => props.value? new Date(props.value).toLocaleString() : ''
        },
        {
            Header: 'Last Run Finished At',
            accessor: 'job.lastFinishedAt',
            Cell : (props) => props.value? new Date(props.value).toLocaleString() : ''
        },
        {
            Header: 'Locked',
            accessor: 'job.lockedAt',
            Cell : (props) => props.value? new Date(props.value).toLocaleString() : ''
        },
        {
            Header: 'Options',
            accessor: 'job._id',
            Cell: props =>  <Button.Group basic size='small'>
                <Popup
                    trigger={
                        <Button icon='reply' onClick={()=>this.requeueJob(props.value)}/>}
                    content='Requeue Job'
                    inverted
                />
                <Popup
                    trigger={
                        <Button icon='trash' onClick={()=>this.show(props.value)}/>}
                    content='Delete Job'
                    inverted
                />
            </Button.Group>
        }
    ]

    @autobind
    show (jobId) {
        this.setState({ open: true, jobToDelete : jobId })
    }

    @autobind
    close() {
        this.setState({ jobToDelete: '', open: false })
    } 

    @autobind
    requeueJob(jobId) {
        requeueJob({jobIds:[jobId]})
            .then((response) => { toastr.success(`Requeued Job ${jobId}`, 'Success!' ); this.loadJobs()})
            .catch((error) => handleError(error))
    }

    @autobind
    onSubmitDeleteJob() {
        let jobId = this.state.jobToDelete
        this.close()
        deleteJob({jobIds:[jobId]})
            .then((response) => { toastr.success(`Deleted Job ${jobId}`, 'Success!' ); this.loadJobs()})
            .catch((error) => handleError(error))
    }

    @autobind
    handleItemClick (e, { name }) {
        this.setState({ activeItem: name })
    }

    @autobind
    handleFilterToggle (e, data) {
        this.setState({ filterable: data.checked })
    }

    componentDidMount() {
        this.loadJobs()
        let updateHandler = setInterval(this.loadJobs, 3000)
        this.setState({updateHandler})
    }

    componentWillUnmount() {
        if(this.state.updateHandler) {
            clearInterval(this.state.updateHandler)
        }
    }

    @autobind
    loadJobs() {
        const store = this.props.store
        fetchJobs()
            .then( (jobdata) => store.jobdata = jobdata)
            .catch( (error) => handleError(error) )
    }

    render() {
        const store = this.props.store
        const { activeItem } = this.state
        return (
            <Container className='inherit' fluid> 
                <Grid className='inherit' stackable>
                    <Grid.Row className='inherit'>
                        <Grid.Column width={3} className='inherit'>
                            <Menu className='inherit' pointing secondary vertical stackable fluid>
                                <Menu.Item name='All Jobs' active={activeItem === 'All Jobs'} onClick={this.handleItemClick}>
                                    <Label >{store.overview.total ? store.overview.total : 0}</Label>
                                    <span style={{color:'#777'}}><strong ><u>All Jobs</u></strong></span>
                                </Menu.Item>
                                <Divider />
                                <Menu.Item name='Scheduled' active={activeItem === 'Scheduled'} onClick={this.handleItemClick}>
                                    <Label color='teal'>{store.overview.scheduled? store.overview.scheduled : 0}</Label>
                                    <span style={{color:'#f2711c'}}>Scheduled</span>
                                </Menu.Item>

                                <Menu.Item name='Running' active={activeItem === 'Running'} onClick={this.handleItemClick}>
                                    <Label color='yellow'>{store.overview.running ? store.overview.running : 0}</Label>
                                    <span style={{color:'#8a6d3b'}}>Running</span>
                                </Menu.Item>

                                <Menu.Item name='Queued' active={activeItem === 'Queued'} onClick={this.handleItemClick}>
                                    <Label color='blue'>{store.overview.queued ? store.overview.queued : 0}</Label>
                                    <span style={{color:'#337ab7'}}>Queued</span>
                                </Menu.Item>

                                <Menu.Item name='Completed' active={activeItem === 'Completed'} onClick={this.handleItemClick}>
                                    <Label color='green'>{store.overview.completed ? store.overview.completed : 0}</Label>
                                    <span style={{color:'#3c763d'}}>Completed</span>
                                </Menu.Item>

                                <Menu.Item name='Failed' active={activeItem === 'Failed'} onClick={this.handleItemClick}>
                                    <Label color='red'>{store.overview.failed ? store.overview.failed : 0}</Label>
                                    <span style={{color:'#a94442'}}>Failed</span>
                                </Menu.Item>

                                <Menu.Item name='Repeating' active={activeItem === 'Repeating'} onClick={this.handleItemClick}>
                                    <Label color='purple'>{store.overview.repeating ? store.overview.repeating : 0}</Label>
                                    <span style={{color:'#6435c9'}}>Repeating</span>
                                </Menu.Item>

                            </Menu>

                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={10}>
                                        <Header as='h2'>
                                            <Icon name='settings' />
                                            <Header.Content>
                                                     All Jobs
                                                <Header.Subheader>
                                                    {this.state.activeItem}
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column >
                                    <Grid.Column width={5}>
                                        <Button.Group className='right floated'>
                                            <Button>Schedule Job</Button>
                                            <Button.Or />
                                            <Button>Select All</Button>
                                            <Button.Or />
                                            <Button>Select None</Button>
                                        </Button.Group>
                                    </Grid.Column>
                                    <Grid.Column width={1}>
                                        <Popup
                                            trigger={<Checkbox toggle checked={this.state.filterable}
                                                onChange={this.handleFilterToggle}/>}
                                            content='Enable Job Filtering'
                                            inverted
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <ReactTable
                                style={{marginTop : '1em'}}
                                data={store.getData(this.state.activeItem)}
                                noDataText='No Jobs Found!'
                                columns={this.columns}
                                filterable={this.state.filterable}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Confirm
                    open={this.state.open}
                    onCancel={this.close}
                    content='Are you sure you want to delete this job?'
                    onConfirm={this.onSubmitDeleteJob}
                />
            </Container>
        )
    }

}

Jobs.propTypes = {
    store : PropTypes.shape({
        jobdata: PropTypes.object.isRequired,
    })
}

Jobs.defaultProps = {
    store :{
        jobdata: {}
    }
}

