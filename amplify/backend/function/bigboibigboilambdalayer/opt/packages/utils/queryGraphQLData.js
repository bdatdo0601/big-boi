const { get } = require("lodash");
const axios = require('axios');
const graphql = require('graphql');
const { print } = graphql;

const queryGraphQLData = async (query, variables, accessorString) => {
    const graphqlData = await axios({
        url: process.env.API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT,
        method: 'post',
        headers: {
          'x-api-key': process.env.API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
        },
        data: {
          query: print(query),
          variables,
        }
      });
    return get(graphqlData, accessorString, graphqlData);
}

exports.queryGraphQLData = queryGraphQLData;
