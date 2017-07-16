import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

class ConfigurationStore {

    @observable configuration = {};

    constructor() {
        mobx.autorun(() => console.log(this.logState))
    }

    @computed get logState() {
        return { configuration : this.configuration }
    }
        
    // @computed get config() {
    // 	return this.configuration
    // }

    // set config(config) {
    //     this.configuration = config
    // }
}

const configurationStore = new ConfigurationStore()

export default configurationStore