module.exports = function (sequelize, DataTypes) {
	return sequelize.define('roleprivilege', {
		id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true }
	}, {
			underscored: true,
		});

}
