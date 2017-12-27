const bcrypt = require('bcryptjs');

module.exports.generate = function(password) {
  let hash = bcrypt.hashSync(password, 8);
  return hash;
}

module.exports.compare = function(pass, hash) {
  return bcrypt.compareSync(pass, hash);
}