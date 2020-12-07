### Deployment
1. Create the `term-project` cluster on google cloud, preferably in the same region/zone as the db
    ```bash
    gcloud container clusters create term-project --preemptible --zone=us-central1-b --num-nodes 3 --enable-autoscaling --min-nodes 1 --max-nodes 6 --workload-pool=cedar-booth-287414.svc.id.goog
    ```
   * the `--workload-pool` option is required to bind kubernetes service accounts to gcp service accounts. [More info](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#enable_on_cluster).
   * the `--enable-autoscaling` option along with the `--min-nodes 1 --max-nodes 6` options allow the node pool to auto scale resources as needed to provide the resources requested by pods in the `k8s.yml`. [More info](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler)
2. Create GCP service accounts `term-project-worker` and `term-project-server`.
   * `term-project-server` needs `Cloud SQL Client`, `Service Account Token Creator`, and `Storage Object Creator` roles
   * `term-project-worker` needs `Cloud SQL Client`, `Logs Writer`, `Monitoring Metric Writer`, and `Storage Object Viewer` roles
3. Ensure you are using the correct k8s context before proceeding with the `apply` commands next by checking `kubectl config get-contexts`. Switch to the one for `term-project` if necessary with `kubectl config use-context <context-name>`.
4. Apply secrets using `kubectl apply -f k8s/secrets.yml`. The secrets.yml should look like:
    ```yml
    apiVersion: v1
    kind: Secret
    metadata:
      name: term-project
    type: Opaque
    stringData:
      RABBITMQ_USER: <value>
      RABBITMQ_PWD: <value>
      PG_USER: <value>
      PG_PWD: <value>
    ```
5. Enable http load balancing for the cluster with `gcloud container clusters update term-project --update-addons=HttpLoadBalancing=ENABLED`
   * See the load balancign tutorial [here](https://cloud.google.com/kubernetes-engine/docs/how-to/load-balance-ingress#gcloud)
6. Deploy the cluster with `kubectl apply -f k8s/k8s.yml`, or by using the cloud build trigger. This will also create the kubernetes service accounts.
7. Relate GCP service accounts with GKE service accounts:
   ```bash
   gcloud iam service-accounts add-iam-policy-binding --role roles/iam.workloadIdentityUser --member "serviceAccount:cedar-booth-287414.svc.id.goog[default/term-project-server]" term-project-server@cedar-booth-287414.iam.gserviceaccount.com
   gcloud iam service-accounts add-iam-policy-binding --role roles/iam.workloadIdentityUser --member "serviceAccount:cedar-booth-287414.svc.id.goog[default/term-project-worker]" term-project-worker@cedar-booth-287414.iam.gserviceaccount.com
   
   # the stuff below is actually already done by the k8s/k8s.yml, but heres how to do it via command line if needed
   # it probably is technically better to do via command line, since it requires specifying project id and gcp specific service accounts, and commiting these to the repo isn't ideal
   kubectl annotate serviceaccount term-project-server iam.gke.io/gcp-service-account=term-project-server@cedar-booth-287414.iam.gserviceaccount.com
   kubectl annotate serviceaccount term-project-worker iam.gke.io/gcp-service-account=term-project-worker@cedar-booth-287414.iam.gserviceaccount.com
   ```
