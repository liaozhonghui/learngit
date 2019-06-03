var Sequelize = require("sequelize");

var sequelize = require('../connection.js');
const Op = Sequelize.Op;
var User = require('./User.js')(sequelize, Sequelize);
var Project = require('./Project')(sequelize, Sequelize, User);

Project.sync({ force: true }).then(function () {
	return Project.bulkCreate([
		{ pro: 'tt12', name: 'beijing-tt', biaoduan: '000001', deleted: true, accessLevel: 12 },
		{ pro: 'tt12', name: 'beijing-tt', biaoduan: '000002', deleted: true, accessLevel: 123 },
		{ pro: 'tt12', name: 'beijing-tt', biaoduan: '000003', deleted: false, accessLevel: 50 }
	]);
}).then((project) => {
	project.forEach(function (value) {
		console.log("project.id:" + value.get({ plain: true }).id);
	});
	return Project.scope('deleted').findAll().then(result => {
		console.log(result.length);
	});
}).then(() => {
	//return Project.scope('activeUsers').findAll().then(result => {console.log(result.length);});

}).catch(err => {
	console.log(err);
});
