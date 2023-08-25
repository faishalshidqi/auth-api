class RefreshAuthenticationUseCase {
	constructor({authenticationRepository, webTokenManager}) {
		this._authenticationRepository = authenticationRepository
		this._webTokenManager = webTokenManager
	}

	async execute(useCasePayload) {
		this._verifyPayload(useCasePayload)
		const {refreshToken} = useCasePayload

		await this._webTokenManager.verifyRefreshToken(refreshToken)
		await this._authenticationRepository.checkAvailabilityToken(refreshToken)

		const {username} = await this._webTokenManager.decodePayload(refreshToken)

		return this._webTokenManager.createAccessToken({username})
	}

	_verifyPayload(payload) {
		const {refreshToken} = payload
		if (!refreshToken) {
			throw new Error('REFRESH_AUTHENTICATION_USE_CASE.REFRESH_TOKEN_NOT_PRESENT')
		}
		if (typeof refreshToken !== 'string') {
			throw new Error('REFRESH_AUTHENTICATION_USE_CASE.INVALID_DATA_TYPE')
		}
	}
}

module.exports = RefreshAuthenticationUseCase
