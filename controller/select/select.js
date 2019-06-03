//select 功能（one,all）
module.exports = function (model, arg, attr) {
	if (arg === 'all') {
		return model.findAll(attr);
	} else {
		return model.findOne(attr);
	}
}