const AuthenticateUser = require('../../Domains/users/entities/AuthenticateUser')
const Authentication = require('../../Domains/authentications/entities/Authentication')

class AuthenticateUserUseCase {
	constructor({userRepository, authenticationRepository, webTokenManager, passwordHash}) {
		this._userRepository = userRepository
		this._authenticationRepository = authenticationRepository
		this._webTokenManager = webTokenManager
		this._passwordHash = passwordHash
	}

	async execute(useCasePayload) {
		const {username, password} = new AuthenticateUser(useCasePayload)
		const encryptedPassword = await this._userRepository.getPasswordByUsername(username)

		await this._passwordHash.compare(password, encryptedPassword)

		const accessToken = await this._webTokenManager.createAccessToken({username})
		const refreshToken = await this._webTokenManager.createRefreshToken({username})

		const auth = new Authentication({
			accessToken,
			refreshToken
		})

		await this._authenticationRepository.addToken(auth.refreshToken)

		return auth
	}
}

module.exports = AuthenticateUserUseCase
