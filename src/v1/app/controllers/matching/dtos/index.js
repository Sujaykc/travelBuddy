const { fromUserOnly } = require('../../common/common-dtos');

module.exports = {
  getMatches: { fromUser: fromUserOnly }
};
