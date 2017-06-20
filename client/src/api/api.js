"use strict";
import clientConfig from 'commons/config';
import axios from 'axios';

export const fetchNumberOfAgents = () => axios.get(clientConfig.apiUrl + '/api/agents/count').then((success) =>  success.data);

export const fetchProjects = () => axios.get(clientConfig.apiUrl + '/api/projects').then((success) =>  success.data);

export const fetchAgents = () => axios.get(clientConfig.apiUrl + '/api/agents').then((success) =>  success.data );

export const fetchAgent = (url) => axios.get(clientConfig.apiUrl + url).then((success) =>  success.data);

export const changeAgentAuthorization = (url,data) => axios.put(clientConfig.apiUrl + url,data).then((success) =>  success.data);

export const changeAgentEnabled = (url,data) => axios.put(clientConfig.apiUrl + url,data).then((success) =>  success.data.message );

export const publishReport = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const clearReport = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const refreshJobLog = (jobid,benchid,btargetid) => axios.get(clientConfig.apiUrl + `/api/pmbot/joblogdetails?job_id=${jobid}&bench_id=${benchid}&btarget_id=${btargetid}`).then((success) =>  success.data[0].LOG_STREAM );

export const submitJob = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const flashTarget = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const rebootTarget = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const disconnectUsbFromTarget = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const connectUsbToTarget = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const login = (config) => axios.get(clientConfig.apiUrl + '/login',config);