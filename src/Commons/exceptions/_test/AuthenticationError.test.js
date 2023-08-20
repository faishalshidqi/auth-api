const AuthenticationError = require('../AuthenticationError')

describe('AuthenticationError', () => {
	it('should create AuthenticationError correctly', () => {
		const authenticationError = new AuthenticationError('auth error!')

		expect(authenticationError.statusCode).toEqual(401)
		expect(authenticationError.message).toEqual('auth error!')
		expect(authenticationError.name).toEqual('AuthenticationError')
	})
})
