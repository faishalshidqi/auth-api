require('dotenv').config()
const Hapi = require('@hapi/hapi')
const users = require('../../Interfaces/http/api/users')
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator')
const ClientError = require('../../Commons/exceptions/ClientError')
const createServer = async (container) => {
	const server = Hapi.server({
		host: process.env.HOST,
		port: process.env.PORT
	})

	await server.register([
		{
			plugin: users,
			options: {container}
		}
	])

	server.ext('onPreResponse', (request, h) => {
		const {response} = request
		if (response instanceof Error) {
			const translatedError = DomainErrorTranslator.translate(response)

			if (translatedError instanceof ClientError) {
				const newResponse = h.response({
					status: 'fail',
					message: translatedError.message
				})
				newResponse.code(translatedError.statusCode)
				return newResponse
			}

			if (!translatedError.isServer) {
				return h.continue
			}

			const newResponse = h.response({
				status: 'error',
				message: 'an error occurred at our server'
			})
			newResponse.code(500)
			return newResponse
		}
		return h.continue
	})
	//console.log(`Server is running on ${server.info.uri}`)
	return server
}

module.exports = createServer
