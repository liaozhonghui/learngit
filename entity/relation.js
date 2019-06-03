//模型加载
var Sequelize = require('sequelize');
var sequelize = require('../connection.js');

var User = require('./User.js')(sequelize, Sequelize);
var UserCheckin = require('./UserCheckin.js/index.js')(sequelize, Sequelize);
var UserAddress = require('./UserAddress.js')(sequelize, Sequelize);
var Role = require('./Role.js')(sequelize, Sequelize);







Promise.all([
	User.create({ username: 'cai', password: 'cai.com' }),
	Role.create({ roleName: '超级管理员' })
]).then(function (results) {
	var user = results[0];
	var role = results[1];
	console.log(results);
	user.setUserRoles(role);

});

