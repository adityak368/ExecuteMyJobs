'use strict'
import clientConfig from 'commons/config'
import axios from 'axios'

export const fetchNumberOfAgents = () => axios.get(clientConfig.apiUrl + '/agents/count').then((success) =>  success.data.connectedAgents)

export const fetchProjects = () => axios.get(clientConfig.apiUrl + '/projects').then((success) =>  success.data)

export const fetchAgents = () => axios.get(clientConfig.apiUrl + '/agents').then((success) =>  success.data )

export const fetchAgent = (agentName) => axios.get(clientConfig.apiUrl + `/agents/${agentName}`).then((success) =>  success.data)

export const changeAgentAuthorization = (agentName,data) => axios.put(clientConfig.apiUrl + `/agents/${agentName}`,data).then((success) =>  success.data)

export const changeAgentEnabled = (agentName,data) => axios.put(clientConfig.apiUrl + `/agents/${agentName}`,data).then((success) =>  success.data.message )

export const createNewConfiguration = (data) => axios.post(clientConfig.apiUrl + '/configurations',data)

export const createNewProject = (data) => axios.post(clientConfig.apiUrl + '/projects',data)

export const deleteProject = (projectName) => axios.delete(clientConfig.apiUrl + `/projects/${projectName}`).then((success) =>  success.data.message  )

export const deleteConfiguration = (configName) => axios.delete(clientConfig.apiUrl + `/configurations/${configName}`).then((success) =>  success.data.message  )

export const fetchConfiguration = (configName) => axios.get(clientConfig.apiUrl + `/configurations/${configName}`).then((success) =>  success.data  )

export const updateConfiguration = (configName, data) => axios.put(clientConfig.apiUrl + `/configurations/${configName}`,data).then((success) =>  success.data.message  )

export const updateBuildStep = (configName, stepid, data) => axios.put(clientConfig.apiUrl + `/configurations/${configName}/buildsteps/${stepid}`,data).then((success) =>  success.data.message  )

export const addBuildStep = (configName,data) => axios.post(clientConfig.apiUrl + `/configurations/${configName}/buildsteps`,data).then((success) =>  success.data.message  )

export const removeBuildStep = (configName,stepid) => axios.delete(clientConfig.apiUrl + `/configurations/${configName}/buildsteps/${stepid}`).then((success) =>  success.data.message  )

export const submitJob = (data) => axios.post(clientConfig.apiUrl + '/jobs', data).then((success) =>  success.data.message  )

export const addAgentFilter = (configName,data) => axios.post(clientConfig.apiUrl + `/configurations/${configName}/agentfilter`,data).then((success) =>  success.data.message  )

export const removeAgentFilter  = (configName,data) => axios.delete(clientConfig.apiUrl + `/configurations/${configName}/agentfilter`, data).then((success) =>  success.data.message  )

export const fetchCompatibleAgents = (configName) => axios.get(clientConfig.apiUrl + `/configurations/${configName}/agents`).then((success) =>  success.data)

export const fetchJobs = () => axios.get(clientConfig.agendashUrl).then((success) =>  success.data)

export const requeueJob = (data) => axios.post(clientConfig.agendashUrl + '/jobs/requeue',data).then((success) =>  success.data)

export const deleteJob = (data) => axios.post(clientConfig.agendashUrl + '/jobs/delete',data).then((success) =>  success.data)

export const fetchJob = (jobId) => axios.get(`/agenda/api?jobid=${jobId}`).then((success) =>  success.data)
