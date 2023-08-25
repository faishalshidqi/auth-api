const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase')
const WebTokenManager = require('../../security/WebTokenManager')
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository')
describe('RefreshAuthenticationUseCase', () => {
	it('should throw error when use case payload did not contain refresh token', async () => {
		// Arrange
		const useCasePayload = {}
		const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

		// Action and Assert
		await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.REFRESH_TOKEN_NOT_PRESENT')
	})

	it('should throw error if refresh error is not string', async () => {
		// Arrange
		const useCasePayload = {
			refreshToken: true
		}
		const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

		// Action and Assert
		await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.INVALID_DATA_TYPE')
	})

	it('should refresh authentication correctly', async () => {
		// Arrange
		const useCasePayload = {
			refreshToken: 'refresh_token'
		}
		const mockAuthenticationRepository = new AuthenticationRepository()
		const mockWebTokenManager = new WebTokenManager()

		// Mocking
		mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve())
		mockWebTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve())
		mockWebTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({username: 'dicoding'}))
		mockWebTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve('access_token'))

		// use case instance initiation
		const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
			authenticationRepository: mockAuthenticationRepository,
			webTokenManager: mockWebTokenManager
		})

		// Action
		const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload)
		// Assert
		expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(useCasePayload.refreshToken)
		expect(mockWebTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken)
		expect(mockWebTokenManager.decodePayload).toBeCalledWith(useCasePayload.refreshToken)
		expect(mockWebTokenManager.createAccessToken).toBeCalledWith({username: 'dicoding'})
		expect(accessToken).toEqual('access_token')
	})
})
