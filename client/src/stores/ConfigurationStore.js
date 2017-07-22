import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

class ConfigurationStore {

    @observable configuration = {};
    @observable compatibleAgents = []

    constructor() {
        mobx.autorun(() => console.log(this.logState))
    }

    @computed get logState() {
        return { configuration : this.configuration, compatibleAgents : this.compatibleAgents }
    }
        
}

const configurationStore = new ConfigurationStore()

export default configurationStore