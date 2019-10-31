
/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload and metadata.
 * @param {!Function} callback Callback function to signal completion.
 */

const container = require('@google-cloud/container');

exports.stopInstancePubSub = (event, callback) => {

    var client = new container.v1.ClusterManagerClient({
        // optional auth parameters.
    });

    var projectId = 'devops-consulting';
    var zone = '-';
    var request = {
        projectId: projectId,
        zone: zone,
    };

    client.listClusters(request)
        .then(responses => {
            var response = responses[0];
            for (i = 0; i < response.clusters.length; i++) {
               if (!response.clusters[i].resourceLabels['keep-alive']) {
                   updatePool(client ,response.clusters[i].zone ,response.clusters[i].name ,0);
               }
            }
        })
        .catch(err => {
            console.error(err);
            callback(null, message);
        });
};


function updatePool(client ,zoneId ,clusterId ,nodeCount) {
    console.log("start update pool");

    var projectId = 'devops-consulting';
    var nodePoolId = 'default-pool';
    var request = {
        projectId: projectId,
        zone: zoneId,
        clusterId: clusterId,
        nodePoolId: nodePoolId,
        nodeCount: nodeCount,
    };
    client.setNodePoolSize(request)
        .then(responses => {
            var response = responses[0];
            console.log("got update pool response " + JSON.stringify(response));

        })
        .catch(err => {
            console.error(err);
        });
}
