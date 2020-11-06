const core = require('@actions/core');
const io = require('@actions/io');
const os = require('os');

const path = require('path');
const fs = require('fs');
const ROAClient = require('@alicloud/pop-core').ROAClient;


const APIEndpoint = `https://cs.aliyuncs.com`

async function run() {
    let accessKeyId = core.getInput('access-key-id', { required: false });
    let accessKeySecret = core.getInput('access-key-secret', { required: false });
    let clusterId = core.getInput('cluster-id', { required: false });

    try {
        let client = new ROAClient({
            accessKeyId,
            accessKeySecret,
            endpoint: APIEndpoint,
            apiVersion: '2015-12-15'
        });
        let result = await client.request('GET', `/k8s/${clusterId}/user_config`)
        let config = result.config
        const dirPath = path.join(os.homedir(), '.kube');
        await io.mkdirP(dirPath);
        const kubeConfigPath = path.join(dirPath, `config`);
        fs.writeFileSync(kubeConfigPath, config, {mode: 0o600});
        core.debug(`kubeconfig file is saved to ${kubeConfigPath}`);
    } catch (err) {
        core.setFailed(`Failed to get kubeconfig file for Kubernetes cluster: ${err}`);
    }
}
run();