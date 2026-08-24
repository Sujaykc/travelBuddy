const { fromUserOnly } = require('../../common/common-dtos');

module.exports = {
  listNotifications: { fromUser: fromUserOnly },
  markRead: require('./mark-read.dto')
};
