const RegisteredUser = require('../RegisteredUser')

describe('a RegisteredUser entity', () => {
	it('should throw error when payload did not contain required property', () => {
		// Arrange
		const payload = {
			username: 'dicoding',
			fullname: 'Dicoding Indoneisa'
		}

		// Action and Assert
		expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_REQUIRED_PROPERTY')
	})

	it('should throw error when payload did not meet specified data type', () => {
		// Arrange
		const payload = {
			id: 980,
			username: 'dicoding',
			fullname: 'Dicoding Indonesia'
		}

		// Action and Assert
		expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.INVALID_DATA_TYPE')
	})

	it('should create registeredUser object correctly', () => {
		// Arrange
		const payload = {
			id: 'user-abc',
			username: 'dicoding',
			fullname: 'Dicoding Indonesia'
		}

		// Action
		const {id, username, fullname} = new RegisteredUser(payload)

		// Assert
		expect(id).toEqual(payload.id)
		expect(username).toEqual(payload.username)
		expect(fullname).toEqual(payload.fullname)
	})
})
