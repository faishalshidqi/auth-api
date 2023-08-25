/* istanbul ignore file */

const {createContainer} = require('instances-container')

// external agency
const {nanoid} = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc.)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')

// use case
const AddUserUseCase = require('../Applications/use_cases/AddUserUseCase')
const UserRepository = require('../Domains/users/UserRepository')
const PasswordHash = require('../Applications/security/PasswordHash')
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const WebTokenManager = require('../Applications/security/WebTokenManager')
const JwtTokenManager = require('./security/JwtTokenManager')
const AuthenticateUserUseCase = require('../Applications/use_cases/AuthenticateUserUseCase')
const LogoutUserUseCase = require('../Applications/use_cases/LogoutUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_cases/RefreshAuthenticationUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
	{
		key: UserRepository.name,
		Class: UserRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool
				},
				{
					concrete: nanoid
				}
			]
		}
	},
	{
		key: AuthenticationRepository.name,
		Class: AuthenticationRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool
				}
			]
		}
	},
	{
		key: PasswordHash.name,
		Class: BcryptPasswordHash,
		parameter: {
			dependencies: [
				{
					concrete: bcrypt
				}
			]
		}
	},
	{
		key: WebTokenManager.name,
		Class: JwtTokenManager,
		parameter: {
			dependencies: [
				{
					concrete: Jwt.token
				}
			]
		}
	}
])

// registering use cases
container.register([
	{
		key: AddUserUseCase.name,
		Class: AddUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'userRepository',
					internal: UserRepository.name
				},
				{
					name: 'passwordHash',
					internal: PasswordHash.name
				}
			]
		}
	},
	{
		key: AuthenticateUserUseCase.name,
		Class: AuthenticateUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'userRepository',
					internal: UserRepository.name
				},
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name
				},
				{
					name: 'webTokenManager',
					internal: WebTokenManager.name
				},
				{
					name: 'passwordHash',
					internal: PasswordHash.name
				}
			]
		}
	},
	{
		key: LogoutUserUseCase.name,
		Class: LogoutUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name
				}
			]
		}
	},
	{
		key: RefreshAuthenticationUseCase.name,
		Class: RefreshAuthenticationUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name
				},
				{
					name: 'webTokenManager',
					internal: WebTokenManager.name
				}
			]
		}
	}
])

module.exports = container
