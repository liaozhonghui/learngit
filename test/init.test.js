//模型加载
const Sequelize = require('sequelize');
const sequelize = require('../connection.js');
const Op = Sequelize.Op;

const User = require('./User.js')(sequelize, Sequelize);
const UserCheckin = require('./UserCheckin.js')(sequelize, Sequelize);
const UserAddress = require('./UserAddress.js')(sequelize, Sequelize);
const Role = require('./Role.js')(sequelize, Sequelize);
const Module = require('./Module.js')(sequelize, Sequelize);
const Privilege = require('./Privilege.js')(sequelize, Sequelize);
const ModulePrivilege = require('./ModulePrivilege.js')(sequelize, Sequelize);
const RolePrivilege = require('./RolePrivilege.js')(sequelize, Sequelize);


//api引用
const select = require('./select/select');
const insert = require('./insert/insert');
const destroy = require('./delete/delete');
const update = require('./update/update');

// 建立模型之间的关联关系
User.hasOne(UserCheckin);
UserCheckin.belongsTo(User);

User.hasMany(UserAddress, { foreignKey: 'user_id', targetKey: 'id', as: 'Address' });

User.belongsToMany(Role, { through: 'userRoles', as: 'UserRoles' });
Role.belongsToMany(User, { through: 'userRoles', as: 'RoleUsers' });


Module.belongsToMany(Privilege, {
	through: ModulePrivilege, as: "MPs",
	foreignKey: 'mId',
});
Privilege.belongsToMany(Module, {
	through: ModulePrivilege, as: 'PMs', foreignKey: 'pId',
});

Role.belongsToMany(ModulePrivilege, { through: RolePrivilege, as: 'RMPs' });
ModulePrivilege.belongsToMany(Role, { through: RolePrivilege, as: 'MPRs' });

function init() {//数据库初始化
	return sequelize.sync({ force: true }).then(function (sync) {
		//console.log(sync);//模型同步成功
		console.log("模型同步成功");
		return User.bulkCreate([{ username: 'root', password: '123456' },
		{ username: 'suproot', password: '234567' },
		{ username: 'common', password: 'cn1234' },
		{ username: 'user00', password: 'user00' }
		]);
	}).then(function () {
		return User.findAll();//查询user的数据库全部记录
	}).then(function (UserAll) {
		//findAll返回的是一个实例数组，里面包含着若干对象,findOne返回了一个实例
		console.log(UserAll[0].username);
		let status = UserAll.some(function (user) {
			console.log(user.username);
			return user.username === 'user1';
		});
		if (status) {
			console.log("数据库中已经存在该用户！");
		} else {
			return insert(User, { username: 'user1', password: 'user1' });
		}
	}).then(function () {
		//s搜索特定元素并创建它
		return User.findOrCreate({ where: { username: 'user01' }, defaults: { password: 'user01' } }).spread(function (user, created) {
			console.log(user.get({ plain: true }));
		});
	}).then(function () {
		return User.findOne({ where: { username: 'user1' } });
	}).then(function (user) {
		//新增一条记录到userCheckin表中
		//UserCheckin.create({ loginIp: '188.0.0.1' }).then();
		console.log(user.get({ plain: true }));
		//增加登陆信息
		let userCheckin = UserCheckin.build({ loginIp: '188.0.0.1' });
		return user.setUserCheckin(userCheckin);

	}).then(function () {
		return User.findOne({ where: { username: 'user1' } });
	}).then(function (user) {
		return Promise.all([
			Role.create({ roleName: '管理员' }),
			user
		]);
	}).then(function (results) {
		let role = results[0];
		let user = results[1];
		return user.setUserRoles(role);
	}).then(() => {
		console.log("数据插入成功！");
	}).catch(function (err) {
		console.log(err);
	});
}

init().then(function () {
	console.log("数据初始化测试成功！");
	return updateLogin();
}).then(function () {
	console.log("用户登陆地址修改成功！");
	return updatePassword();
}).then(function () {
	console.log("用户密码修改成功！")
	return updateUserName();
}).then(function () {
	console.log("用户名称更改成功！");
	return addRole();
}).then(function (results) {
	console.log(results[0]);
	console.log("增加用户角色成功！");
	return selectRoleOne();
}).then(function (result) {
	console.log(result);
	console.log("查询用户角色成功（一条）");
	return addUserLogin();
}).then(function () {
	console.log("新增用户及登陆IP成功！");
	return addUserRole();
}).then(function () {
	console.log("新增用户及用户角色成功！");
}).then(function () {
	return selectRole();
}).then(function (result) {
	console.log("用户角色查询成功" + result.get({ plain: true }));
	return addModule();
}).then(function () {
	console.log("新增模块成功");
	return addPri();
}).then(function () {
	console.log("新增权限记录成功");
	return addModulePri();
}).then(function () {
	console.log("为模块增加权限成功");
	return addRolePri();
}).then(function () {
	console.log("为角色分配权限成功");
}).then(function () {
	//console.log(User.getterMethods());
	console.log("流程成功");
}).catch(function (err) {
	console.log(err);
});

//数据更新
function updateLogin() {//更新loginIp
	return User.findOne({ include: [UserCheckin], where: { username: 'user1' } }).then(function (user) {
		let userCheckin = UserCheckin.build({ userId: user.id, loginIp: '192.168.0.1' });
		return user.setUserCheckin(userCheckin);
	});
}
function updatePassword() {//更新密码
	return User.findOne({ where: { username: 'user1' } }).then(function (user) {
		console.log(user.password);
		return user.update({
			password: 'liao333',
		}, {
				field: ['password']
			});
	});
}
function updateUserName() {//更新用户名
	return User.findOne({ where: { username: 'user1' } }).then(function (user) {
		return user.update({ username: 'liao' });
	});
}
function updateRole() {//更新角色信息
	return User.findOne({
		include: [{ 'model': Role, where: { roleName: '普通用户' } }],
		where: { username: 'user1' }
	}).then(function (user) {
		let role = Role.build({ userId: user.id, roleName: '普通用户' });
		return user.setUserRoles(role);
	});
}

//数据插入
function addRole() {//增加用户角色+1
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
		let user = result[0];
		let role = result[1];
		return user.addUserRoles(role);
	});
}
function addUserRole() {//增加用户角色信息
	return Promise.all([
		User.create({ username: 'hirain', password: 'kb@hirain.com' }),
		Role.create({ roleName: '超级管理员' })
	]).then(function (result) {
		let user = result[0];
		let role = result[1];
		user.addUserRoles(role);
	});
}
function addUser() {//增加用户信息
	return User.create({ username: 'zheng', password: 'zheng123' });
}
function addUserLogin() {//增加用户与登陆信息
	return Promise.all([
		User.create({ username: 'wang', password: 'wang123' }),
		UserCheckin.create({ loginIp: '127.0.0.1' })
	]).then(function (result) {
		let user = result[0];
		let userCheckin = result[1];
		return user.setUserCheckin(userCheckin);
	});
}
//增加权限信息
function addPri() {
	return Privilege.create({ pricode: 'PRI_ADD', priname: '增加' });
}
//增加模块信息
function addModule() {
	return Module.bulkCreate([
		{ modulecode: 'Front_Manage', modulename: '前台管理', parentCode: '' },
		{ modulecode: 'Rear_Manage', modulename: '后台管理', parentCode: '' },
		{ modulecode: 'Account_Manage', modulename: '用户管理', parentCode: '' }
	]);
}
//增加模块权限信息
function addModulePri() {
	return Module.findOne({ modulecode: 'Front_Manage' }).then(function (module) {
		return Promise.all([
			module,
			Privilege.findOne({ where: { pricode: 'PRI_ADD' } }).then(function (privilege) {
				if (privilege) {
					return privilege;
				} else {
					return Privilege.create({ pricode: 'PRI_ADD', priname: '增加' });
				}
			})
		])
	}).then(function (result) {
		let module = result[0];
		let privilege = result[1];
		console.log(JSON.stringify(module) + JSON.stringify(privilege));
		return module.setMPs(privilege);
	});
}
//增加角色权限信息
function addRolePri() {
	return Role.findOne({ roleName: '超级管理员' }).then(function (role) {
		return Promise.all([
			role,
			ModulePrivilege.findOne({ modulecode: 'Front_Manage' })
		]).then(function (result) {
			let role = result[0];
			let modulePri = result[1];
			return role.setRMPs(modulePri);
		});
	});
}

//关联查询
function selectUser() {//查询用户
	return User.findOne({ where: { username: 'liao' } });
}
function selectRole() {//查询角色
	return Role.findOne({ where: { roleName: '管理员' } });
}
function selectRoleAll() {//查询用户与用户角色，左连接user表
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
function selectRoleOne() {//查询用户与用户角色，一条user,role
	return User.findOne({ where: { username: 'user00' } }).then(function (user) {
		return user.getUserRoles();//返回的是一个数组
	});
}


//数据删除
function userDetroy() {//删除用户
	return User.destroy();
}
function DestroyUserRole() {//删除登陆IP
	User.findOne({ where: { username: 'user01' } }).then(function (user) {
		return user.setUserCheckin(null);
	});
}
function DestoryUserIp() {//删除用户并删除登陆Ip
	User.findOne({ where: { username: 'user01' } }).then(function (user) {
		return Promise.all([
			user.setUserCheckin(null),
			user.destory()
		]);
	});
}
function DestroyRole() {//删除角色信息

	//select中需要对角色进行筛选{include:[model:Role,where:{roleName:'条件1'}],where:{username:'条件2'}}
	selectRoleOne().then(function (result) {
		let user = result[0];
		let role = result[1];
		//删除对应角色
		user.removeUserRoles(role);
		//删除全部角色
		user.setUserRoles([]);
	});
}