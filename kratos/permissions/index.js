const { shield, deny } = require('graphql-shield');

const permissions = shield({
  Query: {
    ping: allow
  }
});
module.exports = {
    permissions
}