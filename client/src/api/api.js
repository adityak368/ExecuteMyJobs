"use strict";
import clientConfig from 'commons/config';
import axios from 'axios';

export const fetchNumberOfAgents = () => axios.get(clientConfig.apiUrl + '/api/agents/count').then((success) =>  success.data);

export const fetchProjects = () => axios.get(clientConfig.apiUrl + '/api/projects').then((success) =>  success.data);

export const fetchAgents = () => axios.get(clientConfig.apiUrl + '/api/projects').then((success) =>  success.data );

export const fetchTargetDetails = (benchid,btargetid) => axios.get(clientConfig.apiUrl + '/api/pmbot/targetstatus').then( (success) => {

    let allTargets = success.data;
    for( var target in allTargets) {
        if (allTargets[target].BENCH_ID === benchid && allTargets[target].BTARGET_ID === btargetid) {
            var allTests = allTargets[target].TEST_CASES.TestName;
            var result = [];
            for (var i in allTests) {
                var newTest = {};
                newTest.TEST_NAME = allTests[i];
                newTest.TEST_IS_SELECTED = false;
                newTest.TEST_PROGRESS = 0;
                newTest.TEST_COMMAND = '';
                result.push(newTest);
            }
            return result;
        }
    }
    return [];
});

export const fetchTargets = () => axios.get(clientConfig.apiUrl + '/api/pmbot/targetstatus').then((success) =>  success.data);

export const fetchBenches = () => axios.get(clientConfig.apiUrl + '/api/pmbot/benchstatus').then((success) =>  success.data);

export const submitFreeHandCommand = (cmd) => axios.post(clientConfig.apiUrl + '/api/pmbot/freehand',{ cmd }).then((success) =>  success.data.message );

export const publishReport = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const clearReport = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const refreshJobLog = (jobid,benchid,btargetid) => axios.get(clientConfig.apiUrl + `/api/pmbot/joblogdetails?job_id=${jobid}&bench_id=${benchid}&btarget_id=${btargetid}`).then((success) =>  success.data[0].LOG_STREAM );

export const submitJob = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const flashTarget = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const rebootTarget = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const disconnectUsbFromTarget = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const connectUsbToTarget = (data) => axios.post(clientConfig.apiUrl + '/api/pmbot/jobsubmit',data);

export const login = (config) => axios.get(clientConfig.apiUrl + '/login',config);