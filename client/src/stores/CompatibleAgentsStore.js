import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

class CompatibleAgentsStore {
    @observable compatibleAgents = [];

    constructor() {
        mobx.autorun(() => console.log(this.logState))
    }

    @computed get logState() {
        return { compatibleAgents : this.compatibleAgents}
    }
        
    @computed get agents() {
    	return this.compatibleAgents
    }

    set agents(agents) {
        this.compatibleAgents = agents
    }

}

const compatibleAgentsStore = new CompatibleAgentsStore()

export default compatibleAgentsStore