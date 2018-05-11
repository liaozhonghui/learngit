module.exports = function (sequelize, DataTypes) {
	return sequelize.define('module', {
		id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true },
		modulecode: { type: DataTypes.STRING, allowNull: false, comment: '模块代码', unique: true },
		modulename: { type: DataTypes.STRING, allowNull: false, comment: '模块名称' },
		parentCode: { type: DataTypes.STRING, comment: '父模块代码' }
	},
		{
			timestamps: true,
			underscored: true,
			freezeTableName: true,
			tableName: 'module',
			charset: 'utf8',
			collate: 'utf8_general_ci'
		});
}