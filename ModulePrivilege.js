module.exports = function (sequelize, DataTypes) {
	return sequelize.define('moduleprivilege', {
		id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true },
	}, {
			underscored: true,
		});
};