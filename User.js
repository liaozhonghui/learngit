module.exports = function (sequelize, DataTypes) {
	return sequelize.define('User', {
		id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true },
		username: { type: DataTypes.STRING, allowNull: false, comment: '用户名', unique: true },
		password: { type: DataTypes.STRING, allowNull: false, comment: '用户密码' },
		active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, comment: '是否正常状态' }
	},
		{
			timestamps: true,
			underscored: true,
			paranoid: true,
			freezeTableName: true,
			tableName: 'user',
			charset: 'utf8',
			collate: 'utf8_general_ci'
		}, {
			getterMethods: {
				fullName() {
					return this.username + ' ' + this.password;
				}
			},

			setterMethods: {
				fullName(value) {
					const names = value.split(' ');

					this.setDataValue('username', names.slice(0, -1).join(' '));
					this.setDataValue('password', names.slice(-1).join(' '));
				},
			}
		});
}