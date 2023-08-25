class AuthenticateUser {
	constructor(payload) {
		this._verifyPayload(payload)
		const {username, password} = payload
		this.username = username
		this.password = password
	}

	_verifyPayload({username, password}) {
		if (!username || !password) {
			throw new Error('AUTHENTICATE_USER.NOT_CONTAIN_REQUIRED_PROPERTY')
		}
		if (typeof username !== 'string' || typeof password !== 'string') {
			throw new Error('AUTHENTICATE_USER.INVALID_DATA_TYPE')
		}
		if (username.length > 50) {
			throw new Error('AUTHENTICATE_USER.USERNAME_CHAR_EXCEEDS_LIMIT')
		}
		if (!username.match(/^[\w]+$/)) {
			throw new Error('AUTHENTICATE_USER.USERNAME_CONTAINS_RESTRICTED_CHAR')
		}
	}
}

module.exports = AuthenticateUser
