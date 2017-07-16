import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

class AuthStore {
    @observable isAuthenticated = localStorage.getItem('isAuthenticated') || false;
    @observable user = JSON.parse(localStorage.getItem('user')) || {};

    constructor() {
        mobx.autorun(() => console.log(this.logState))
    }

    @computed get logState() {
        return { isAuthenticated : this.isAuthenticated, user: this.user }
    }
        
    @computed get isLoggedIn() {
    	return this.isAuthenticated
    }

    signout() {
        this.isAuthenticated = false
        this.user = {}
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
    }

    authenticate(user) {
        this.isAuthenticated = true
        this.user = user
        localStorage.setItem('isAuthenticated', true)
        localStorage.setItem('user', JSON.stringify(user))

    }

}

const authStore = new AuthStore()

export default authStore