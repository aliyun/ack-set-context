# Setting context for Kubernetes cluster of Alibaba Cloud Kubernetes Service (ACK)
Use this GitHub Action to [set context for Kubernetes cluster of Alibaba Cloud Kubernetes (ACK)](https://www.aliyun.com/product/kubernetes). 


Set the ```KUBECONFIG``` environment variable by cluster id for K8s cluster managed by ACK.


```yaml
- uses: aliyun/ack-set-context@v1
  with:
    access-key-id: '<access key id>'
    access-key-secret: '<access key secret>'
    cluster-id: '<cluster id>'
```

Refer to the action metadata file for details about all the inputs: [action.yml](https://github.com/aliyun/ack-set-context/blob/master/action.yml)

### Prerequisite
Get the access-key-id and access-key-secret of Alibaba Cloud and add them as as [secrets](https://developer.github.com/actions/managing-workflows/storing-secrets/) in the GitHub repository.
