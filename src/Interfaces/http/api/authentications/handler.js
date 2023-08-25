const AuthenticateUserUseCase = require('../../../../Applications/use_cases/AuthenticateUserUseCase')
const RefreshAuthenticationUseCase = require('../../../../Applications/use_cases/RefreshAuthenticationUseCase')
const LogoutUserUseCase = require('../../../../Applications/use_cases/LogoutUserUseCase')

class AuthenticationHandler {
	constructor(container) {
		this._container = container
	}

	async postAuthenticationHandler(request, h) {
		const authenticateUserUseCase = this._container.getInstance(AuthenticateUserUseCase.name)
		const {accessToken, refreshToken} = await authenticateUserUseCase.execute(request.payload)
		const response = h.response({
			status: 'success',
			data: {
				accessToken,
				refreshToken
			}
		})
		response.code(201)
		return response
	}

	async putAuthenticationHandler(request) {
		const refreshAuthenticationUseCase = this._container.getInstance(RefreshAuthenticationUseCase.name)
		const accessToken = await refreshAuthenticationUseCase.execute(request.payload)

		return {
			status: 'success',
			data: {
				accessToken
			}
		}
	}

	async deleteAuthenticationHandler(request) {
		const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase.name)
		await logoutUserUseCase.execute(request.payload)
		return {
			status: 'success'
		}
	}
}

module.exports = AuthenticationHandler
