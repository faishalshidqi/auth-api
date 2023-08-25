const Authentication = require('../Authentication')
describe('Authentication entity', () => {
	it('should throw error when payload did not contain required property', () => {
		// Arrange
		const payload = {
			accessToken: 'accessToken'
		}

		// Action and Assert
		expect(() => new Authentication(payload)).toThrowError('AUTHENTICATION.NOT_CONTAIN_REQUIRED_PROPERTY')
	})

	it('should throw error when payload did not meet data type specification', () => {
		// Arrange
		const payload = {
			accessToken: true,
			refreshToken: {}
		}

		// Action and Assert
		expect(() => new Authentication(payload)).toThrowError('AUTHENTICATION.INVALID_DATA_TYPE')
	})

	it('should create Authentication object correctly', () => {
		// Arrange
		const payload = {
			accessToken: 'accessToken',
			refreshToken: 'refreshToken'
		}

		// Action
		const auth = new Authentication(payload)

		// Assert
		expect(auth).toBeInstanceOf(Authentication)
		expect(auth.accessToken).toEqual(payload.accessToken)
		expect(auth.refreshToken).toEqual(payload.refreshToken)
	})
})
