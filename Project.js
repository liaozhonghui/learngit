//作用域概念学习
module.exports = function (sequelize, DataTypes, model1) {
	return sequelize.define('project', {
		pro: DataTypes.STRING,
		name: DataTypes.STRING,
		biaoduan: DataTypes.STRING,
		deleted: DataTypes.BOOLEAN,
		accessLevel: DataTypes.INTEGER
	}, {
			defaultScope: {
				where: {
					active: true
				}
			},
			scopes: {
				deleted: {
					where: {
						deleted: true
					}
				},
				activeUsers: {
					include: [
						{ model: model1, where: { active: true } }
					]
				},
				random: function () {
					return {
						where: {
							someNumber: Math.random()
						}
					}
				},
				accessLevel: function (value) {
					return {
						where: {
							accessLevel: {
								[Op.gte]: value
							}
						}
					}
				}
			}
		});
}