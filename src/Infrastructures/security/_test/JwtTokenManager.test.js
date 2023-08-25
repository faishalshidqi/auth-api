const Jwt = require('@hapi/jwt')
const JwtTokenManager = require('../JwtTokenManager')
const InvariantError = require('../../../Commons/exceptions/InvariantError')

describe('JwtTokenManager', () => {
	describe('createAccessToken function', () => {
		it('should create accessToken correctly', async () => {
			// Arrange
			const payload = {
				username: 'dicoding',
			}
			const mockJwtToken = {
				generate: jest.fn().mockImplementation(() => 'mock_token')
			}
			const jwtTokenManager = new JwtTokenManager(mockJwtToken)

			// Action
			const accessToken = await jwtTokenManager.createAccessToken(payload)

			// Assert
			expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY)
			expect(accessToken).toEqual('mock_token')
		})
	})

	describe('createRefreshToken function', () => {
		it('should create refreshToken correctly', async () => {
			// Arrange
			const payload = {
				username: 'dicoding',
			}
			const mockJwtToken = {
				generate: jest.fn().mockImplementation(() => 'mock_token')
			}
			const jwtTokenManager = new JwtTokenManager(mockJwtToken)

			// Action
			const refreshToken = await jwtTokenManager.createRefreshToken(payload)

			// Assert
			expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY)
			expect(refreshToken).toEqual('mock_token')
		})
	})

	describe('verifyRefreshToken function', () => {
		it('should throw InvariantError if token verification is invalid', async () => {
			// Arrange
			const jwtTokenManager = new JwtTokenManager(Jwt.token)
			const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding'})

			// Action and Assert
			await expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects.toThrowError(InvariantError)
		})

		it('should not throw InvariantError when refresh token verification is valid', async () => {
			// Arrange
			const jwtTokenManager = new JwtTokenManager(Jwt.token)
			const refreshToken = await jwtTokenManager.createRefreshToken({username: 'dicoding'})

			// Action and Assert
			await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrowError(InvariantError)
		})
	})

	describe('decodePayload function', () => {
		it('should decode payload correctly', async () => {
			// Arrange
			const jwtTokenManager = new JwtTokenManager(Jwt.token)
			const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding'})

			// Action
			const {username: expectedUsername} = await jwtTokenManager.decodePayload(accessToken)

			// Action and Assert
			expect(expectedUsername).toEqual('dicoding')
		})
	})
})
