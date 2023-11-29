const functions = require('@google-cloud/functions-framework');
const {SearchServiceClient} = require('@google-cloud/discoveryengine').v1beta;


// const projectId = 'YOUR_PROJECT_ID';
// const location = 'YOUR_LOCATION';              // Options: 'global', 'us', 'eu'
// const collectionId = 'default_collection';     // Options: 'default_collection'
// const dataStoreId = 'YOUR_DATA_STORE_ID'       // Create in Cloud Console
// const servingConfigId = 'default_config';      // Options: 'default_config'
// const searchQuery = 'form';

const apiEndpoint =
  location === 'global'
    ? 'discoveryengine.googleapis.com'
    : `${location}-discoveryengine.googleapis.com`;

// Instantiates a client
const client = new SearchServiceClient({apiEndpoint: apiEndpoint});
function search(searchQuery) {
  const name = client.projectLocationCollectionDataStoreServingConfigPath(
    projectId,
    location,
    collectionId,
    dataStoreId,
    servingConfigId
  );

  const request = {
    pageSize: 10,
    query: searchQuery,
    servingConfig: name,
  };
 

  // Perform search request
  const response =  client.search(request, {
    autoPaginate: false,
  });
  console.log(response);
  return response;
}


functions.http('vertexAISearchHttp', (req, res) => {
if (req.body.sessionInfo && req.body.sessionInfo.parameters) {
  const params = req.body.sessionInfo.parameters;
  const searchQuery = params.searchQuery;
  

  search(searchQuery).then((results) => {
  let  status = {
      "success": true
    }
  const response = {
    fulfillmentResponse: {
    messages: [
        {
            text: {
                text: [
                  JSON.stringify(results) // this is the message for the agent to return
                ],
            },
        },
    ],
    },
    sessionInfo: {
        parameters: status , // these are the parameters that will be set and returned to the agent
    },
};
    res.send(response);
  });
}

});