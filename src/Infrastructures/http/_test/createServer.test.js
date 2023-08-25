const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
const WebTokenManager = require('../../../Applications/security/WebTokenManager')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')

describe('HTTP server', () => {
	afterAll(async () => {
		await pool.end()
	})

	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await AuthenticationsTableTestHelper.cleanTable()
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
		expect(response.statusCode).toStrictEqual(404)
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
			expect(response.statusCode).toStrictEqual(400)
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
			expect(response.statusCode).toStrictEqual(400)
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
			expect(response.statusCode).toStrictEqual(400)
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
			expect(response.statusCode).toStrictEqual(400)
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
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('username is not available')
		})
	})

	describe('when POST /authentications', () => {
		it('should respond 201 and new tokens', async () => {
			// Arrange
			const requestPayload = {
				username: 'dicoding',
				password: 'secret'
			}
			const server = await createServer(container)

			// add user
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia'
				}
			})

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(201)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.accessToken).toBeDefined()
			expect(responseJson.data.refreshToken).toBeDefined()
		})

		it('should respond 400 if username is not found', async () => {
			// Arrange
			const requestPayload = {
				username: 'dicoding',
				password: 'secret'
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('username is not found')
		})

		it('should respond 401 if payload is wrong', async () => {
			// Arrange
			const requestPayload = {
				username: 'dicoding',
				password: 'wrong_pass'
			}
			const server = await createServer(container)

			// add user
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia'
				}
			})

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(401)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('Invalid credentials')
		})

		it('should respond 400 if login payload did not contain required property', async () => {
			// Arrange
			const requestPayload = {
				password: 'dicoding'
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('username or password is not present')
		})

		it('should respond 400 if login payload has invalid data type', async () => {
			// Arrange
			const requestPayload = {
				username: true,
				password: {}
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('Invalid data type')
		})
	})

	describe('when PUT /authentications', () => {
		it('should return 200 and new access token', async () => {
			// Arrange
			const server = await createServer(container)
			// add user
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia'
				}
			})

			// authenticate user
			const loginResponse = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret'
				}
			})

			const {data: {refreshToken}} = JSON.parse(loginResponse.payload)

			// Action
			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {
					refreshToken
				}
			})

			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(200)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.accessToken).toBeDefined()
		})

		it('should return 400 when payload did not contain refresh token', async () => {
			// Arrange
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {}
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('refresh token is not present')
		})

		it('should return 400 if refresh token is not string', async () => {
			// Arrange
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {
					refreshToken: true
				}
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('Invalid data type')
		})

		it('should return 400 if refresh token is invalid', async () => {
			// Arrange
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {
					refreshToken: 'invalid_token'
				}
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('Invalid refresh token')
		})

		it('should return 400 if refresh token is not in the database', async () => {
			// Arrange
			const server = await createServer(container)
			const refreshToken = await container.getInstance(WebTokenManager.name).createRefreshToken({username: 'dicoding'})

			// Action
			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {
					refreshToken
				}
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('Invalid refresh token')
		})
	})

	describe('when DELETE /authentications', () => {
		it('should respond 200 if refresh token is valid', async () => {
			// Arrange
			const server = await createServer(container)
			const refreshToken = 'refresh_token'
			await AuthenticationsTableTestHelper.addToken(refreshToken)

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: '/authentications',
				payload: {
					refreshToken
				}
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(200)
			expect(responseJson.status).toEqual('success')
		})

		it('should respond 400 if refresh token is not in the database', async () => {
			// Arrange
			const server = await createServer(container)
			const refreshToken  = 'refresh_token'

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: '/authentications',
				payload: {
					refreshToken
				}
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('Invalid refresh token')
		})

		it('should respond 400 if refresh token is not string', async () => {
			// Arrange
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: '/authentications',
				payload: {
					refreshToken: 907
				}
			})

			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toStrictEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual('Invalid data type')
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
		expect(response.statusCode).toStrictEqual(500)
		expect(responseJson.status).toEqual('error')
		expect(responseJson.message).toEqual('an error occurred at our server')
	})
})
