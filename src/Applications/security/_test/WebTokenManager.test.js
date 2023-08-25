const WebTokenManager = require('../WebTokenManager')

describe('WebTokenManager interface', () => {
	it('should throw error when invoked with abstract/unimplemented method', async () => {
		// Arrange
		const webTokenManager = new WebTokenManager()

		// Action and Assert
		await expect(webTokenManager.createAccessToken('')).rejects.toThrowError('WEB_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
		await expect(webTokenManager.createRefreshToken('')).rejects.toThrowError('WEB_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
		await expect(webTokenManager.verifyRefreshToken('')).rejects.toThrowError('WEB_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
		await expect(webTokenManager.decodePayload('')).rejects.toThrowError('WEB_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
	})
})
