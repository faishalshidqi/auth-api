const bcrypt = require('bcrypt')
const BcryptPasswordHash = require('../BcryptPasswordHash')
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError')

describe('BcryptPasswordHash', () => {
	describe('hash function', () => {
		it('should hash the password correctly', async () => {
			// Arrange
			const spyHash = jest.spyOn(bcrypt, 'hash')
			const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)

			// Action
			const hashedPassword = await bcryptPasswordHash.hash('plain_password')

			// Assert
			expect(typeof hashedPassword).toEqual('string')
			expect(hashedPassword).not.toEqual('plain_password')
			expect(spyHash).toBeCalledWith('plain_password', 10)
		})
	})

	describe('comparePassword function', () => {
		it('should throw AuthenticationError if password does not match', async () => {
			// Arrange
			const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)

			// Action and Assert
			await expect(bcryptPasswordHash.compare('plain_password', 'encrypted_password')).rejects.toThrowError(AuthenticationError)
		})

		it('should not return AuthenticationError if password does match', async () => {
			// Arrange
			const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)
			const plainPassword = 'secret'
			const encryptedPassword = await bcryptPasswordHash.hash(plainPassword)

			// Action and Assert
			await expect(bcryptPasswordHash.compare(plainPassword, encryptedPassword)).resolves.not.toThrowError(AuthenticationError)
		})
	})
})
