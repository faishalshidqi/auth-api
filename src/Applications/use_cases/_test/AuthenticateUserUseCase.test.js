const Authentication = require('../../../Domains/authentications/entities/Authentication')
const UserRepository = require('../../../Domains/users/UserRepository')
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository')
const WebTokenManager = require('../../security/WebTokenManager')
const PasswordHash = require('../../security/PasswordHash')
const AuthenticateUserUseCase = require('../AuthenticateUserUseCase')
describe('AuthenticateUserUseCase', () => {
	it('should do the authentication correctly', async () => {
		// Arrange
		const useCasePayload = {
			username: 'dicoding',
			password: 'secret'
		}
		const expectedAuthResult = new Authentication({
			accessToken: 'access_token',
			refreshToken: 'refresh_token'
		})

		const mockUserRepository = new UserRepository()
		const mockAuthenticationRepository = new AuthenticationRepository()
		const mockWebTokenManager = new WebTokenManager()
		const mockPasswordHash = new PasswordHash()

		// Mocking
		mockUserRepository.getPasswordByUsername = jest.fn()
			.mockImplementation(() => Promise.resolve('encrypted_password'))
		mockPasswordHash.compare = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockWebTokenManager.createAccessToken = jest.fn()
			.mockImplementation(() => Promise.resolve(expectedAuthResult.accessToken))
		mockWebTokenManager.createRefreshToken = jest.fn()
			.mockImplementation(() => Promise.resolve(expectedAuthResult.refreshToken))
		mockAuthenticationRepository.addToken = jest.fn()
			.mockImplementation(() => Promise.resolve())

		// use case instance initiation
		const authenticateUserUseCase = new AuthenticateUserUseCase({
			userRepository: mockUserRepository,
			authenticationRepository: mockAuthenticationRepository,
			webTokenManager: mockWebTokenManager,
			passwordHash: mockPasswordHash
		})

		// Action
		const actualAuthentication = await authenticateUserUseCase.execute(useCasePayload)

		// Assert
		expect(actualAuthentication).toEqual(expectedAuthResult)
		expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(useCasePayload.username)
		expect(mockPasswordHash.compare).toBeCalledWith(useCasePayload.password, 'encrypted_password')
		expect(mockWebTokenManager.createAccessToken).toBeCalledWith({username: useCasePayload.username})
		expect(mockWebTokenManager.createRefreshToken).toBeCalledWith({username: useCasePayload.username})
		expect(mockAuthenticationRepository.addToken).toBeCalledWith(expectedAuthResult.refreshToken)
	})
})
