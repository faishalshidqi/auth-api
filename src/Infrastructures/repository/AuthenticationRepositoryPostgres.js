const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository')
const InvariantError = require('../../Commons/exceptions/InvariantError')

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
	constructor(pool) {
		super()
		this._pool = pool
	}

	async addToken(token) {
		const query = {
			text: 'insert into authentications values($1)',
			values: [token]
		}
		await this._pool.query(query)
	}

	async checkAvailabilityToken(token) {
		const query = {
			text: 'select * from authentications where token = $1',
			values: [token]
		}
		const result = await this._pool.query(query)

		if (!result.rowCount) {
			throw new InvariantError('Invalid refresh token')
		}
	}

	async deleteToken(token) {
		const query = {
			text: 'delete from authentications where token = $1',
			values: [token]
		}
		await this._pool.query(query)
	}
}

module.exports = AuthenticationRepositoryPostgres
