const RegisterUser = require('../RegisterUser')

describe('a RegisterUser entity', () => {
	it('should throw error when payload did not contain required property', () => {
		// Arrange
		const noPassPayload = {
			username: 'abc',
			fullname: 'abc'
		}

		// Action and Assert
		expect(() => new RegisterUser(noPassPayload)).toThrowError('REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY')
	})
	it('should throw error when payload did not meet specified data type', () => {
		// Arrange
		const payload = {
			username: 123,
			password: true,
			fullname: {}
		}

		// Action and Assert
		expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.INVALID_DATA_TYPE')
	})

	it('should throw error when username consists of more than 50 characters', () => {
		// Arrange
		const payload = {
			username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
			fullname: 'Dicoding Indonesia',
			password: 'abc',
		}

		// Action and Assert
		expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CHAR_EXCEEDS_LIMIT')
	})

	it('should throw error when username contains restricted character', () => {
		// Arrange
		const payload = {
			username: 'dico ding',
			fullname: 'dicoding',
			password: 'abc'
		}

		// Action and Assert
		expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHAR')
	})

	it('should create registerUser object correctly', () => {
		// Arrange
		const payload = {
			username: 'dicoding',
			fullname: 'Dicoding Indonesia',
			password: 'abc'
		}

		// Action
		const {username, fullname, password} = new RegisterUser(payload)

		// Assert
		expect(username).toEqual(payload.username)
		expect(fullname).toEqual(payload.fullname)
		expect(password).toEqual(payload.password)
	})
})
