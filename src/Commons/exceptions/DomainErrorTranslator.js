const InvariantError = require('./InvariantError')
const DomainErrorTranslator = {
	translate(error) {
		return DomainErrorTranslator._directories[error.message] || error
	}
}

DomainErrorTranslator._directories = {
	'REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('cannot create user due to unspecified required property'),
	'REGISTER_USER.INVALID_DATA_TYPE': new InvariantError('cannot create user due to invalid data type'),
	'REGISTER_USER.USERNAME_CHAR_EXCEEDS_LIMIT': new InvariantError('cannot create user due to char limit'),
	'REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHAR': new InvariantError('cannot create user due to username is containing restricted character'),
	'AUTHENTICATE_USER.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('username or password is not present'),
	'AUTHENTICATE_USER.INVALID_DATA_TYPE': new InvariantError('Invalid data type'),
	'AUTHENTICATE_USER.USERNAME_CHAR_EXCEEDS_LIMIT': new InvariantError('Username char exceeds limit'),
	'AUTHENTICATE_USER.USERNAME_CONTAINS_RESTRICTED_CHARACTER': new InvariantError('Username contains restricted character'),
	'REFRESH_AUTHENTICATION_USE_CASE.REFRESH_TOKEN_NOT_PRESENT': new InvariantError('refresh token is not present'),
	'REFRESH_AUTHENTICATION_USE_CASE.INVALID_DATA_TYPE': new InvariantError('Invalid data type'),
	'DELETE_AUTHENTICATION_USE_CASE.REFRESH_TOKEN_NOT_PRESENT': new InvariantError('refresh token is not present'),
	'DELETE_AUTHENTICATION_USE_CASE.INVALID_DATA_TYPE': new InvariantError('Invalid data type')
}

module.exports = DomainErrorTranslator
