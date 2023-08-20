const DomainErrorTranslator = require('../DomainErrorTranslator')
const InvariantError = require('../InvariantError')

describe('DomainErrorTranslator', () => {
	it('should translate error correctly', () => {
		expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY')))
			.toStrictEqual(new InvariantError('cannot create user due to unspecified required property'))
		expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.INVALID_DATA_TYPE')))
			.toStrictEqual(new InvariantError('cannot create user due to invalid data type'))
		expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CHAR_EXCEEDS_LIMIT')))
			.toStrictEqual(new InvariantError('cannot create user due to char limit'))
		expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHAR')))
			.toStrictEqual(new InvariantError('cannot create user due to username is containing restricted character'))
	})

	it('should return original error when error message is not required to be translated', () => {
		// Arrange
		const error = new Error('some_error_message')

		// Action
		const translatedError = DomainErrorTranslator.translate(error)

		// Assert
		expect(translatedError).toStrictEqual(error)
	})
})
