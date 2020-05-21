let db = require('../models');

class BaseRepository {
	constructor(modelName) {
		if (!modelName) {
			throw new Error('model name is empty');
		}

		if (!db[modelName]) {
			throw new Error(`${modelName} is not defined`);
		}

		this._model = db[modelName];
		this._modelName = modelName;
	}

	static getInstance() {
		// let key = this._model;
		let key = (this).name;
		if (!BaseRepository._instances) {
			BaseRepository._instances = {};
		}
		if (!BaseRepository._instances[key]) {
			this._instances[key] = new this();
		}

		return this._instances[key];
	}

	getModel() {
		return this._model;
	}

	static getModelByName(name) {
		return new BaseRepository(name);
	}

	static getRepoByName(name) {
		return new BaseRepository(name);
	}
	async create(data, option = null, setting = null) {
		let instance = await this._model.create(data, option);
		return instance;
	}

	async find(filter, option) {
		return await this._model.find(filter, option);
	}

	async findAll(filter, option) {
		return await this._model.findAll(filter, option);
	}

	async findAndCountAll(filter, option) {
		return await this._model.findAndCountAll(filter, option)
	}

	async findById(id, option) {
		return await this._model.findByPk(id, option);
	}

	async findOne(filter, option) {
		return await this._model.findOne(filter, option);
	}

	async count(filter) {
		return await this._model.count(filter);
	}

	async update(data, option, setting) {
		if (!option) {
			option.returning = true;
		}
		let result = await this._model.update(data, option);
		return result;
	}

	async updateAttributes(object, data, option, setting) {
		let result = await object.updateAttributes(data, option);
		return result;
	}

	async save(object, option = null, setting = null) {
        object = await object.save(option);
        return object;
	}

	destroy(filter) {
		return new Promise((resolve, reject) => {
			this._model.destroy(filter)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				})
		})
	}

	groupBy(field) {
		return new Promise((resolve, reject) => {
			this._model.findAll({
				attributes: [field],
				group: field,
				where: {
					id: {
						$gte: 1,
					}
				}
			})
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				})
		})
	}
}

module.exports = BaseRepository;