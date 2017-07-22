import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

class AgentsStore {
    @observable allAgents = [];

    constructor() {
        mobx.autorun(() => console.log(this.logState))
    }

    @computed get logState() {
        return { agents : this.allAgents}
    }
        
    @computed get connectedAgents() {
    	return this.allAgents.filter((agent) => agent.isConnected)
    }

    @computed get disconnectedAgents() {
    	return this.allAgents.filter((agent) => !agent.isConnected)
    }

    @computed get unauthorizedAgents() {
    	return this.allAgents.filter((agent) => !agent.isAuthorized)
    }

    set agents(agents) {
        this.allAgents = agents
    }

}

const agentsStore = new AgentsStore()

export default agentsStore