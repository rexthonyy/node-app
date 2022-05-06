const { shield, deny } = require('graphql-shield');

export const permissions = shield({
  Query: {
    ping: deny
  }
});