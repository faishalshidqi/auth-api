const AuthenticationHandler = require('./handler')
const routes = require('./routes')
module.exports = {
	name: 'authentications',
	register: async(server, {container}) => {
		const authenticationsHandler = new AuthenticationHandler(container)
		server.route(routes(authenticationsHandler))
	}
}
