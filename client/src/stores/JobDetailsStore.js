import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

class JobDetailsStore {
    @observable currentjobdata = []

    constructor() {
        mobx.autorun(() => console.log(this.logState))
    }

    @computed get logState() {
        return { jobdata : this.currentjobdata}
    }

    @computed get jobdata() {
        return this.currentjobdata
    }

    set jobdata(jobdata) {
        this.currentjobdata = jobdata
    }
}

const jobDetailsStore = new JobDetailsStore()

export default jobDetailsStore