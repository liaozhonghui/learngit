var Sequelize = require('sequelize');

//建立数据库连接
var sequelize = new Sequelize(
	'user_role', // 数据库名
	'liao',   // 用户名
	'liao123',   // 用户密码
	{
		dialect: 'mysql',  // 数据库使用mysql
		host: 'localhost', // 数据库服务器ip
		port: 3306,        // 数据库服务器端口
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},
	}
);
module.exports = sequelize;