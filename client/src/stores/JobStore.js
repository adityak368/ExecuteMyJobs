import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

class JobStore {
    @observable jobdata = {};

    constructor() {
        mobx.autorun(() => console.log(this.logState))
    }

    @computed get logState() {
        return { jobdata : this.jobdata}
    }
        
    @computed get scheduled() {
    	return this.jobdata.jobs.filter((job) => job.scheduled)
    }

    @computed get running() {
    	return this.jobdata.jobs.filter((job) => job.running)
    }

    @computed get queued() {
    	return this.jobdata.jobs.filter((job) => job.queued)
    }

    @computed get failed() {
    	return this.jobdata.jobs.filter((job) => job.failed)
    }

    @computed get completed() {
    	return this.jobdata.jobs.filter((job) => job.completed)
    }

    @computed get repeating() {
    	return this.jobdata.jobs.filter((job) => job.repeating)
    }

    @computed get all() {
    	return this.jobdata.jobs
    }

    @computed get overview() {
        if(this.jobdata.overview)
            return this.jobdata.overview[0]
        else 
            return {}
    }

    set jobdata(jobdata) {
        this.jobdata = jobdata
    }

    getData (activeItem) {
        if(activeItem==='All Jobs') {
            return this.all
        } else if(activeItem==='Running') {
            return this.running
        } else if(activeItem==='Scheduled') {
            return this.scheduled
        } else if(activeItem==='Queued') {
            return this.queued
        } else if(activeItem==='Completed') {
            return this.completed
        } else if(activeItem==='Failed') {
            return this.failed
        } else if(activeItem==='Repeating') {
            return this.repeating
        }
    }

}

const jobStore = new JobStore()

export default jobStore