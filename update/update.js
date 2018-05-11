module.exports = function (model, attr) {
	return model.findAll(attr);
}