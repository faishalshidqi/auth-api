class LogoutUserUseCase {
	constructor({authenticationRepository}) {
		this._authenticationRepository = authenticationRepository
	}

	async execute(useCasePayload) {
		this._verifyPayload(useCasePayload)
		const {refreshToken} = useCasePayload
		await this._authenticationRepository.checkAvailabilityToken(refreshToken)
		await this._authenticationRepository.deleteToken(refreshToken)
	}

	_verifyPayload(payload) {
		const {refreshToken} = payload
		if (!refreshToken) {
			throw new Error('DELETE_AUTHENTICATION_USE_CASE.REFRESH_TOKEN_NOT_PRESENT')
		}
		if (typeof refreshToken !== 'string') {
			throw new Error('DELETE_AUTHENTICATION_USE_CASE.INVALID_DATA_TYPE')
		}
	}
}

module.exports = LogoutUserUseCase
