var mongoose = require('mongoose');
var co = require('co');
var CastleUserSchema = require('../../db/schema/castle-user');

var UserService = module.exports = {};

// 获取所有用户
UserService.getUserList = co.wrap(function * (app) {
  var connection = mongoose.createConnection(app.config.mongoServer);
  var User = connection.model('User', CastleUserSchema, 'castle-user');
  var users = yield User.find({}).exec();

  return users;
});

// confirm
UserService.confirm = co.wrap(function * (app, data) {
  var connection = mongoose.createConnection(app.config.mongoServer);
  var User = connection.model('User', CastleUserSchema, 'castle-user');
  var userData = {
    name: data.name.trim(),
    join: data.join,
    joinWith: data.joinWith,
    foodRequest: data.foodRequest,
    otherFoodRequest: data.otherFoodRequest,
    createTime: new Date().getTime(),
    stay: data.stay,
    joinNum: data.joinNum,
    phone: data.phone,
    address: data.address,
  }

  // 检验用户
  // var find = yield User.findOne({
  //   $or: [
  //     {mobile: {$eq: data.mobile, $ne: ''}},
  //     {email: {$eq: data.email, $ne: ''}}
  //   ]
  // }).exec();
  //
  // if (!find) return false;

  var insertResult = yield User.create(userData);

  console.log(insertResult)

  return insertResult;
});
