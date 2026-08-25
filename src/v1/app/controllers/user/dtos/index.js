const { fromUserOnly } = require('../../common/common-dtos');

module.exports = {
  getProfile: { fromUser: fromUserOnly },
  updateProfile: require('./update-profile.dto')
};
