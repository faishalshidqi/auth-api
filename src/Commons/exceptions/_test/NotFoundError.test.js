const NotFoundError = require('../NotFoundError')

describe('NotFoundError', () => {
	it('should create NotFoundError correctly', () => {
		const notFoundError = new NotFoundError('resource is not found')

		expect(notFoundError.statusCode).toEqual(404)
		expect(notFoundError.message).toEqual('resource is not found')
		expect(notFoundError.name).toEqual('NotFoundError')
	})
})
