const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('HTTP server', () => {
	afterAll(async () => {
		await pool.end()
	})

	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
	})

	describe('when POST /users', () => {
		it('should respond with 201 and persists user data', async () => {
			// Arrange
			const requestPayload = {
				username: 'dicoding',
				password: 'secret',
				fullname: 'Dicoding Indonesia'
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			console.log(response)
			expect(response.statusCode).toEqual(201)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.addedUser).toBeDefined()
		})
	})
})
