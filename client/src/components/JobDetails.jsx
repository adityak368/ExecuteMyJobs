import React, {Component} from 'react'
import queryString from 'query-string'
import {fetchJob} from 'api/api'
import { handleError } from 'commons/errorhandler'
import JobDetailsContainer from 'components/JobDetailsStatistic'
import {Container, Icon, Grid, Message, Accordion} from 'semantic-ui-react'

import {observer, PropTypes as MobxPropTypes} from 'mobx-react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

@observer
export default class JobDetails extends Component {

    state = {result: 'Logs will appear here...', timeoutId: null}
    
    componentDidMount() {
        this.loadJob()
        this.props.socket.on('updateJobDetails', this.refreshJob)
    }

    componentWillUnmount() {
        this.props.socket.removeListener('updateJobDetails', this.refreshJob)
    }

    @autobind
    refreshJob(job) {
        if(job._id===this.props.match.params.jobId)
            this.loadJob()
    }

    @autobind
    loadJob() {
        const store = this.props.store
        fetchJob(this.props.match.params.jobId)
            .then( (jobdata) => store.jobdata = jobdata)
            .catch( (error) => handleError(error) )
    }

    render() {
        const store = this.props.store
        const logs = (store.jobdata.length>0 && store.jobdata[0].job.data.log) ? store.jobdata[0].job.data.log.map((logitem,index) => ({
            key: `log-${index}`,
            title: <strong>{`[${new Date(logitem.timestamp).toLocaleString()}]: ${logitem.step} => ${logitem.command}`}</strong>,
            content: <pre>{logitem.log}</pre>,
        })) : []
        return (
            <Container>
                <Grid centered columns={1}>
                    <Grid.Column>
                        <JobDetailsContainer data={store.jobdata.length>0 ? store.jobdata[0] : {}}/>
                    </Grid.Column>
                    <Message.Header>
                        <strong>{ store.jobdata.length>0 ? store.jobdata[0].job.failReason : null}</strong>
                    </Message.Header>
                    <Grid.Row centered columns={1}>
                        <Grid.Column>
                            <Message>
                                <Message.Header>
                                    Job Log
                                </Message.Header>
                                <Accordion panels={logs} exclusive={false} fluid /> 
                            </Message>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
            </Container>
        )
    }

}

JobDetails.propTypes = {
    store : PropTypes.shape({
        currentjobdata: MobxPropTypes.observableArray.isRequired,
    })
}

JobDetails.defaultProps = {
    store :{
        currentjobdata: []
    }
}
