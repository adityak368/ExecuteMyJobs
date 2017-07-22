import React, {Component} from 'react'
import {Icon, Statistic, Message} from 'semantic-ui-react'

import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

export default class JobDetailsStatistic extends Component {

    @autobind
    getStatus(job) {

        if(!job)
            return ''
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
    }

    render() {
        const status = this.getStatus(this.props.data)
        return (
            <Message success>
                <Message.Content>
                    <Statistic.Group widths='four' size="tiny">
                        <Statistic>
                            <Statistic.Value><Icon name='tags'/> NAME </Statistic.Value>
                            <Statistic.Label>{this.props.data.job ? this.props.data.job.data.type : ''}</Statistic.Label>
                        </Statistic>

                        <Statistic>
                            <Statistic.Value><Icon name="desktop"/> AGENT </Statistic.Value>
                            <Statistic.Label>{this.props.data.job ? this.props.data.job.data.agent : ''}</Statistic.Label>
                        </Statistic>

                        <Statistic>
                            <Statistic.Value><Icon name="hourglass half"/> PROGRESS </Statistic.Value>
                            <Statistic.Label>{(this.props.data.job ? this.props.data.job.data.progress : '0') + '%'}</Statistic.Label>
                        </Statistic>

                        <Statistic>
                            <Statistic.Value><Icon name="wait"/> STATUS </Statistic.Value>
                            <Statistic.Label>{this.props.data.job ? status : ''}</Statistic.Label>
                        </Statistic>
                    </Statistic.Group>
                </Message.Content>
            </Message>)
    }
}

JobDetailsStatistic.propTypes = {
    data : PropTypes.object.isRequired
}

JobDetailsStatistic.defaultProps = {
    data :{}
}
