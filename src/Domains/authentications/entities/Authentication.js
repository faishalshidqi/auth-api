class Authentication {
	constructor(payload) {
		this._verifyPayload(payload)
		this.accessToken = payload.accessToken
		this.refreshToken = payload.refreshToken
	}

	_verifyPayload(payload) {
		const {accessToken, refreshToken} = payload
		if (!accessToken || !refreshToken) {
			throw new Error('AUTHENTICATION.NOT_CONTAIN_REQUIRED_PROPERTY')
		}
		if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
			throw new Error('AUTHENTICATION.INVALID_DATA_TYPE')
		}
	}
}

module.exports = Authentication
