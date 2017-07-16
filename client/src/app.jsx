import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import 'stylesheets/commons.scss'
import Base from 'components/Base'

import AuthStore from 'stores/AuthStore'

export default class App extends Component {
    render () {
        return (
            <BrowserRouter>
                <Base store={AuthStore}/>
            </BrowserRouter>
        )
    }
}
