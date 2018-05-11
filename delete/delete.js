module.exports = function (model, attr, arg) {
	if (arg === 'all') {
		return model.destroy([]).catch(err => {
			model.destroy(null).catch(err => {
				console.log(err);
			});
		});
	} else {
		return model.destroy(attr);
	}
}