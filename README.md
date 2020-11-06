# Setting context for Alibaba Cloud Container Service for Kubernetes (ACK)
Use this GitHub Action to [set context for Alibaba Cloud Container Service for Kubernetes (ACK)](https://www.aliyun.com/product/kubernetes). It will retrieve the ```kubeconfig``` file by cluster id for K8s cluster of ACK.


```yaml
- uses: denverdino/ack-set-context@v1
  with:
    access-key-id: '<access key id>'
    access-key-secret: '<access key secret>'
    cluster-id: '<cluster id>'
```

Refer to the action metadata file for details about all the inputs: [action.yml](https://github.com/denverdino/ack-set-context/blob/master/action.yml)

```

### Prerequisite
Get the access-key-id and access-key-secret of Alibaba Cloud and add them as as [secrets](https://developer.github.com/actions/managing-workflows/storing-secrets/) in the GitHub repository.
