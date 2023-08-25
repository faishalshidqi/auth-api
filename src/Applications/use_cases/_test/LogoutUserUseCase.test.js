const LogoutUserUseCase = require('../LogoutUserUseCase')
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository')
describe('LogoutUserUseCase', () => {
	it('should throw error when use case payload did not contain refresh token', async () => {
		// Arrange
		const useCasepayload = {}
		const logoutUserUseCase = new LogoutUserUseCase({})

		// Action and Assert
		await expect(logoutUserUseCase.execute(useCasepayload)).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.REFRESH_TOKEN_NOT_PRESENT')
	})

	it('should throw error if refresh token is not string', async () => {
		// Arrange
		const useCasePayload = {
			refreshToken: true
		}
		const logoutUserUseCase = new LogoutUserUseCase({})

		// Action and Assert
		await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.INVALID_DATA_TYPE')
	})

	it('should delete authentication correctly', async () => {
		// Arrange
		const useCasePayload = {
			refreshToken: 'refresh_token'
		}

		const mockAuthenticationRepository = new AuthenticationRepository()
		mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve())
		mockAuthenticationRepository.deleteToken = jest.fn().mockImplementation(() => Promise.resolve())

		const logoutUserUseCase = new LogoutUserUseCase({
			authenticationRepository: mockAuthenticationRepository
		})

		// Action
		await logoutUserUseCase.execute(useCasePayload)

		// Assert
		expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
		expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
	})
})
