//模型加载
var Sequelize = require('sequelize');
var sequelize = require('../connection.js');
const Op = Sequelize.Op;

var User = require('./User.js')(sequelize, Sequelize);
var UserCheckin = require('./entity/UserCheckin.js/index.js')(sequelize, Sequelize);
var UserAddress = require('./UserAddress.js')(sequelize, Sequelize);
var Role = require('./Role.js')(sequelize, Sequelize);

//api引用
var select = require('./select/select');
var insert = require('./insert/insert');
var destroy = require('./delete/delete');
var update = require('./update/update');

// 建立模型之间的关系
User.hasOne(UserCheckin);
UserCheckin.belongsTo(User);
User.hasMany(UserAddress, { foreignKey: 'user_id', targetKey: 'id', as: 'Address' });
User.belongsToMany(Role, { through: 'userRoles' });
Role.belongsToMany(User, { through: 'userRoles' });

function init() {//数据库初始化
	return sequelize.sync({ force: true }).then(function (sync) {
		//console.log(sync);//模型同步成功
		console.log("模型同步成功");
		return User.bulkCreate([{ username: 'root', password: '123456' },
		{ username: 'suproot', password: '234567' },
		{ username: 'common', password: 'cn1234' }
		]);
	}).then(function () {
		return User.findAll();//查询user的数据库全部记录
	}).then(function (UserAll) {
		//findAll返回的是一个实例数组，里面包含着若干对象,findOne返回了一个实例
		console.log(UserAll[0].username);
		var status = UserAll.some(function (user) {
			console.log(user.username);
			return user.username === 'user1';
		});
		if (status) {
			console.log("数据库中已经存在该用户！");
		} else {
			return insert(User, { username: 'user1', password: '123456' });
		}
	}).then(function () {
		//s搜索特定元素并创建它
		return User.findOrCreate({ where: { username: 'user1' }, defaults: { password: '123456' } }).spread(function (user, created) {
			console.log(user.get({ plain: true }));
		});
	}).then(function () {
		return User.findOne({ where: { username: 'common' } });
	}).then(function (user) {
		//新增一条记录到userCheckin表中
		//UserCheckin.create({ loginIp: '188.0.0.1' }).then();
		console.log(user.get({ plain: true }));
		//增加登陆信息
		var userCheckin = UserCheckin.build({ loginIp: '127.0.0.1' });
		return Promise.all([
			user.setUserCheckin(userCheckin),
			user
		]);
	}).then(function (results) {
		console.log("测试promise,all功能");
		var userCheckin = results[0];
		var user = results[1];
		console.log(results);
		return Promise.all([
			Role.create({ roleName: '普通用户' }),
			user
		]);
	}).then(function (results) {
		var role = results[0];
		var user = results[1];
		return user.setRoles(role);
	}).then(() => {
		console.log("数据插入成功！");
		return sequelize.transaction(function (t) {
			return User.create({
				username: 'hehe',
				password: '123456'
			}, { transaction: t }).then(function (user) {
				return user.setShooter({
					name: 'haha'
				}, { transaction: t });
			});
		}).then(function (result) {
			console.log("事务被提交！");
		}).catch(function (err) {
			console.log("事务已经被回滚");
		});
	}).catch(function (err) {
		console.log(err);
	});
}

init().then(result => {
	console.log("数据初始化测试成功！");
	return selectRole1();
	//return 1;
}).then(function (results) {
	//console.log(results);
	results.forEach(function (tag) {
		console.log(tag);
	});
}).catch(function (err) {
	console.log(err);
});;

function selectRole() {//左连接user,role数据表
	return User.findAll({
		include: [
			{
				'model': Role,
				rolename: {
					[Op.ne]: null
				}
			},
		],
		where: {
			username: 'common'
		}
	});
}
function selectRole1() {
	return User.findOne({ where: { username: 'common' } }).then(function (user) {
		return user.getRoles();
	});
}

function addRole() {//增加用户角色
	return User.findOne({
		include: [
			{
				'model': Role,
				as: 'UserRoles'
			},
		],
		where: {
			username: 'liao'
		}
	}).then(function (user) {
		console.log(user);
		return Promise.all([
			user,
			Role.create({ roleName: '普通用户' })
		]);
	}).then(function (result) {
		var user = result[0];
		var role = result[1];
		return user.setUserRoles(role);
	});
}



