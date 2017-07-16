import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

class HomeStore {
    @observable allProjects = [];

    constructor() {
        mobx.autorun(() => console.log(this.logState))
    }

    @computed get logState() {
        return { allProjects : this.allProjects}
    }
        
    @computed get projects() {
    	return this.allProjects
    }

    set projects(projects) {
        this.allProjects = projects
    }

}

const homeStore = new HomeStore()

export default homeStore