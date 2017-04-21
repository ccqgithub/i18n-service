var mongoose = require('mongoose');
var co = require('co');
var RsvpUserSchema = require('../../db/schema/rsvp-user');

var UserService = module.exports = {};

// 获取所有用户
UserService.getUserList = co.wrap(function * (app) {
  var connection = mongoose.createConnection(app.config.mongoServer);
  var User = connection.model('User', RsvpUserSchema, 'rsvp-user');
  var users = yield User.find({}).exec();

  return users;
});

// confirm
UserService.confirm = co.wrap(function * (app, data) {
  var connection = mongoose.createConnection(app.config.mongoServer);
  var User = connection.model('User', RsvpUserSchema, 'rsvp-user');
  var find = yield User.findOne({
    $or: [
      {mobile: {$eq: data.mobile, $ne: ''}},
      {email: {$eq: data.email, $ne: ''}}
    ]
  }).exec();

  if (!find) return false;

  var updateResult = yield User.update({
    _id: find._id
  }, {
    confirmed: true,
    confirmedNum: data.num
  }).exec();

  return find;
});

// confirm
UserService.sign = co.wrap(function * (app, data) {
  var connection = mongoose.createConnection(app.config.mongoServer);
  var User = connection.model('User', RsvpUserSchema, 'rsvp-user');
  var find = yield User.findOne({
    _id: data.id
  }).exec();

  if (!find) throw new Error('用户不存在');
  if (!find.confirmed) throw new Error('该用户未确认报名');

  var updateResult = yield User.update({
    _id: find._id
  }, {
    sigendCount: find.sigendCount + 1,
    lastSignedTime: new Date().getTime(),
    signedTimes: find.signedTimes.concat(new Date().getTime()),
  }).exec();

  var find = yield User.findOne({
    _id: data.id
  }).exec();

  return find;
});
