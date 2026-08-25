const { fromUserOnly } = require('../../common/common-dtos');

module.exports = {
  sendRequest: require('./send-request.dto'),
  handleRequest: require('./handle-request.dto'),
  listConnections: { fromUser: fromUserOnly }
};
