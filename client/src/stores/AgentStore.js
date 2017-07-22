import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

class AgentStore {
    @observable currentAgent = {};

    constructor() {
        mobx.autorun(() => console.log(this.logState))
    }

    @computed get logState() {
        return { agent : this.currentAgent}
    }
        
    @computed get agent() {
    	return this.currentAgent
    }

    set agent(agent) {
        this.currentAgent = agent
    }

}

const agentStore = new AgentStore()

export default agentStore