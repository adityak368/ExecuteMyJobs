import React, {Component} from 'react'
import {Dimmer, Loader,Segment,Image} from 'semantic-ui-react'
import PropTypes from 'prop-types'

export default class PreLoader extends Component {

    render() {
        return (
            <Segment>
                <Dimmer active inverted={this.props.inverted}>
                    <Loader inverted={this.props.inverted} content={this.props.message}/>
                </Dimmer>
                <Image src='img/short-paragraph.png'/>
                <Image src='img/short-paragraph.png'/>
                <Image src='img/short-paragraph.png'/>
            </Segment>
        )
    }

}

PreLoader.propTypes = {
    message: PropTypes.string,
    inverted : PropTypes.bool
}

PreLoader.defaultProps = {
    message: 'Fetching Data!. Please Wait!',
    inverted: true
}