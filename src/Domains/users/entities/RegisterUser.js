class RegisterUser {
	constructor(payload) {
		this._verifyPayload(payload)
		const { username, password, fullname } = payload
		this.username = username
		this.password = password
		this.fullname = fullname
	}

	_verifyPayload({username, password, fullname}) {
		if (!password || !username || !fullname) {
			throw new Error('REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY')
		}

		if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
			throw new Error('REGISTER_USER.INVALID_DATA_TYPE')
		}

		if (username.length > 50) {
			throw new Error('REGISTER_USER.USERNAME_CHAR_EXCEEDS_LIMIT')
		}

		if (!username.match(/^[\w]+$/)) {
			throw new Error('REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHAR')
		}
	}
}
module.exports = RegisterUser
