const UserRepository = require('../../Domains/users/UserRepository')
const InvariantError = require('../../Commons/exceptions/InvariantError')
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser')

class UserRepositoryPostgres extends UserRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async verifyAvailableUsername(username) {
		const query = {
			text: 'select username from users where username = $1',
			values: [username]
		}
		const result = await this._pool.query(query)
		if (result.rowCount) {
			throw new InvariantError('username is not available')
		}
	}

	async addUser(registerUser) {
		const {username, password, fullname} = registerUser
		const id = `user-${this._idGenerator()}`

		const query = {
			text: 'insert into users values($1, $2, $3, $4) returning id, username, fullname',
			values: [id, username, password, fullname]
		}
		const result = await this._pool.query(query)
		return new RegisteredUser({...result.rows[0]})
	}
}

module.exports = UserRepositoryPostgres
