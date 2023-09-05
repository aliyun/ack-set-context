# Setting context for Kubernetes cluster of Alibaba Cloud Kubernetes Service (ACK)
Use this GitHub Action to [set context for Kubernetes cluster of Alibaba Cloud Kubernetes (ACK)](https://www.aliyun.com/product/kubernetes) or [set context for cluster of Alibaba Distributed Cloud Container Platform for Kubernetes (ACK One)](https://www.aliyun.com/product/aliware/adcp). 


Set the ```KUBECONFIG``` environment variable by cluster id for K8s cluster managed by ACK or for ACK One hub cluster.


```yaml
- uses: aliyun/ack-set-context@v1
  with:
    ## 'ack' or 'ackone'
    cluster-type: '<cluster type>'
    access-key-id: '<access key id>'
    access-key-secret: '<access key secret>'
    ## if cluster-type is "ackone", fill up ACK One hub cluster id
    cluster-id: '<cluster id>'
```

Refer to the action metadata file for details about all the inputs: [action.yml](https://github.com/aliyun/ack-set-context/blob/master/action.yml)

### Prerequisite
1. Get the access-key-id and access-key-secret of Alibaba Cloud and add them as [secrets](https://developer.github.com/actions/managing-workflows/storing-secrets/) in the GitHub repository.
2. If is `ackone`, the AK/SK permissions need to be minimized, please refer to [Grant permissions to a RAM user](https://www.alibabacloud.com/help/en/ack/distributed-cloud-container-platform-for-kubernetes/user-guide/grant-permissions-to-a-ram-user-1?spm=a2c63.p38356.0.0.60f81fd4if2ccM) to configure `AliyunAdcpReadOnlyAccess` RAM permissions and `admin` RBAC role.