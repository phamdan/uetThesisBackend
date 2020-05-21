const setting = require('../config/setting.json');
const axios = require('axios')

class Client {
    constructor(clientName){
        if (!clientName) {
			throw new Error('client name is empty');
		}

		if (!setting[clientName]) {
			throw new Error(`${clientName} is not defined`);
		}

        this._client = setting[clientName];
        this._url = setting[clientName].url;
		this._clientName = clientName;
    }

    async request(endpoint, method, body, headers = null){
        let url = `${this._url}${endpoint}`;
        let config = {
            url: url,
            method: method,
            headers: {...headers},
            data: body,
            timeout: 10000,
            validateStatus: function (status) {
                return status >= 200 && status < 600;
            }
        }
        try {
            return await axios(config);
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Client