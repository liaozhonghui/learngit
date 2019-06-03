module.exports = function (sequelize, DataTypes) {
	return sequelize.define('privilege', {
		id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true },
		pricode: { type: DataTypes.STRING, allowNull: false, comment: '权限代码', unique: true },
		priname: { type: DataTypes.STRING, allowNull: false, comment: '权限名称' }
	},
		{
			timestamps: true,
			underscored: true,
			freezeTableName: true,
			tableName: 'privilege',
			charset: 'utf8',
			collate: 'utf8_general_ci'
		});
}