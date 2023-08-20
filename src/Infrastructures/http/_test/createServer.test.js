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

	it('should respond 404 when requesting unregistered route', async () => {
		// Arrange
		const server = await createServer({})

		// Action
		const response = await server.inject({
			method: 'GET',
			url: '/unregisteredRoute'
		})

		// Assert
		expect(response.statusCode).toEqual(404)
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
			expect(response.statusCode).toEqual(201)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.addedUser).toBeDefined()
		})

		it('should respond 400 when request payload not contain required property', async () => {
			// Arrange
			const requestPayload = {
				fullname: 'Dicoding Indonesia',
				password: 'secret'
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
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('cannot create user due to unspecified required property')
		})

		it('should respond 400 when request payload does not meet data type requirement', async () => {
			// Arrange
			const requestPayload = {
				username: 'dicoding',
				password: 'secret',
				fullname: ['Dicoding Indonesia']
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
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('cannot create user due to invalid data type')
		})

		it('should respond 400 when username is more than 50 character', async () => {
			// Arrange
			const requestPayload = {
				username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
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
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('cannot create user due to char limit')
		})

		it('should respond 400 when username contains restricted character', async () => {
			// Arrange
			const requestPayload = {
				username: 'dicoding indonesia',
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
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('cannot create user due to username is containing restricted character')
		})

		it('should respond 400 when username is unavailable', async () => {
			await UsersTableTestHelper.addUser({username: 'dicoding'})
			const requestPayload = {
				username: 'dicoding',
				fullname: 'Dicoding Indonesia',
				password: 'super_secret'
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
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('username is not available')
		})
	})

	it('should handle server error correctly', async () => {
		// Arrange
		const requestPayload = {
			username: 'dicoding',
			fullname: 'Dicoding Indonesia',
			password: 'super_secret'
		}
		const server = await createServer({})
		const response = await server.inject({
			method: 'POST',
			url: '/users',
			payload: requestPayload
		})

		// Assert
		const responseJson = JSON.parse(response.payload)
		expect(response.statusCode).toEqual(500)
		expect(responseJson.status).toEqual('error')
		expect(responseJson.message).toEqual('an error occurred at our server')
	})
})
