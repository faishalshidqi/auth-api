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
	'REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHAR': new InvariantError('cannot create user due to username is containing restricted character')
}

module.exports = DomainErrorTranslator
