const AuthenticateUser = require('../AuthenticateUser')

describe('AuthenticateUser entity', () => {
	it('should throw error when payload did not contain required property', () => {
		// Arrange
		const payload = {
			username: 'dicoding'
		}

		// Action and Assert
		expect(() => new AuthenticateUser(payload)).toThrowError('AUTHENTICATE_USER.NOT_CONTAIN_REQUIRED_PROPERTY')
	})

	it('should throw error when payload did not meet specified data type', () => {
		// Arrange
		const payload = {
			username: true,
			password: {}
		}

		// Action and Assert
		expect(() => new AuthenticateUser(payload)).toThrowError('AUTHENTICATE_USER.INVALID_DATA_TYPE')
	})

	it('should throw error when username consists of more than 50 characters', () => {
		// Arrange
		const payload = {
			username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
			password: 'secret'
		}

		// Action and Assert
		expect(() => new AuthenticateUser(payload)).toThrowError('AUTHENTICATE_USER.USERNAME_CHAR_EXCEEDS_LIMIT')
	})

	it('should throw error when username contains restricted character', () => {
		// Arrange
		const payload = {
			username: 'dico ding',
			password: 'secret'
		}

		// Action and Assert
		expect(() => new AuthenticateUser(payload)).toThrowError('AUTHENTICATE_USER.USERNAME_CONTAINS_RESTRICTED_CHAR')
	})

	it('should not throw error when username contains underscore character', () => {
		// Arrange
		const payload = {
			username: 'dico_ding',
			password: 'secret'
		}

		// Action and Assert
		expect(() => new AuthenticateUser(payload)).not.toThrowError('AUTHENTICATE_USER.USERNAME_CONTAINS_RESTRICTED_CHAR')
	})

	it('should create authenticateUser object correctly', () => {
		// Arrange
		const payload = {
			username: 'dicoding',
			password: 'secret'
		}

		// Action
		const authenticateUser = new AuthenticateUser(payload)

		// Assert
		expect(authenticateUser).toBeInstanceOf(AuthenticateUser)
		expect(authenticateUser.username).toEqual(payload.username)
		expect(authenticateUser.password).toEqual(payload.password)
	})
})
