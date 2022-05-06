const { shield, deny } = require('graphql-shield');

const permissions = shield({
  Query: {
    ping: deny
  }
});
module.exports = {
    permissions
}