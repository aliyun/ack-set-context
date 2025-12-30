const core = require('@actions/core');

const path = require('path');
const fs = require('fs');
const ROAClient = require('@alicloud/pop-core').ROAClient;
const popCore = require('@alicloud/pop-core');



const APIEndpoint = `https://cs.aliyuncs.com`
const APIEndpointAdcp = 'https://adcp.aliyuncs.com'


async function run() {
    let accessKeyId = core.getInput('access-key-id', { required: true });
    let accessKeySecret = core.getInput('access-key-secret', { required: true });
    let securityToken = core.getInput('security-token', { required: false });
    let clusterId = core.getInput('cluster-id', { required: false });
    let clusterType = core.getInput('cluster-type', { required: false });
    let privateIpAddress = core.getBooleanInput('private-ip-address', { required: false });
    let apiEndpoint = core.getInput('api-endpoint', { required: false });

    try {
        let kubeconfig = ""
        if (clusterType.toLocaleLowerCase() === "one") { // get ACK One Hub Cluster kubeconfig
            const endpointOne = apiEndpoint || APIEndpointAdcp;
            core.info(`Using endpoint: ${endpointOne}`);
            kubeconfig = await getAckOneHubKubeconfig(accessKeyId, accessKeySecret, securityToken, 
                endpointOne, clusterId, privateIpAddress)
        } else { // get ACK Cluster kubeconfig
            const endpointAck = apiEndpoint || APIEndpoint;
            core.info(`Using endpoint: ${endpointAck}`);
            let client = new ROAClient({
                accessKeyId,
                accessKeySecret,
                securityToken,
                endpoint: endpointAck,
                apiVersion: '2015-12-15'
            });
            let query = {};
            if (privateIpAddress) {
                query.PrivateIpAddress = true;
            }
            core.info(`Using query: ${JSON.stringify(query)}`);
            let result = await requestWithRetry(client, 'GET', `/k8s/${clusterId}/user_config`, query)
            kubeconfig = result.config
        }

        const runnerTempDirectory = process.env['RUNNER_TEMP']; // Using process.env until the core libs are updated
        const kubeconfigPath = path.join(runnerTempDirectory, `kubeconfig_${Date.now()}`);
        core.debug(`Writing kubeconfig contents to ${kubeconfigPath}`);
        fs.writeFileSync(kubeconfigPath, kubeconfig);
        fs.chmodSync(kubeconfigPath, '600');
        core.exportVariable('KUBECONFIG', kubeconfigPath);
        console.log('KUBECONFIG environment variable is set');
    } catch (err) {
        core.setFailed(`Failed to get kubeconfig file for Kubernetes cluster: ${err}`);
    }
}

async function requestWithRetry(client, method, path, query = {}, retries = 3, retryDelay = 1000) {
	try {
		return await client.request(method, path, query);
	} catch (err) {
		if (retries > 0) {
			core.info(`Retrying after ${retryDelay}ms...`);
			await new Promise(resolve => setTimeout(resolve, retryDelay));
			return await requestWithRetry(client, method, path, query, retries - 1, retryDelay * 2);
		} else {
			throw err;
		}
	}
}

async function getAckOneHubKubeconfig(accessKeyId, accessKeySecret, securityToken, apiEndpoint, clusterId, privateIpAddress) {
    let client = new popCore({
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        securityToken: securityToken,
        endpoint: apiEndpoint,
        apiVersion: '2022-01-01'
    });

    let params = {
        ClusterId: clusterId,
    }
    if (privateIpAddress) {
        params.PrivateIpAddress = true;
        core.info('Using private IP address');
    }
    let requestOption = {
        method: 'POST',
        formatParams: false,
    };

    let result = await requestActionWithRetry(client, 'DescribeHubClusterKubeconfig', params, requestOption)
    return result.Kubeconfig
}

async function requestActionWithRetry(client, action, params, requestOption, retries = 3, retryDelay = 1000) {
    try {
        return await client.request(action, params, requestOption);
    } catch (err) {
        if (retries > 0) {
            core.info(`Retrying after ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return await requestActionWithRetry(client, action, params, requestOption,retries - 1, retryDelay * 2);
        } else {
            throw err;
        }
    }
}

run();