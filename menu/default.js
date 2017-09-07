const NAME = 'default.js'

const errLog = global.errLog

class Menu {
	constructor(opts) {
		console.log('constructor - menu', NAME)

		this.init(opts)
	}

	async init({ id, app }) {
		// const app = app.app
		const session = app.sessions[id]
		const services = app.services

		if (session && session.ping) {
			console.log(services.getDT(), id, 'user at session, state')
			session.ping = new Date()
		} else {
			console.log(services.getDT(), id, 'no session, search at base')
			session.ping = new Date()

			const userSettings = await services.getSettings(id)
				.catch(err => errLog(NAME, 'services.getSettings', err))

			if (userSettings) {
				// find a user
				console.log('default.js, find a user', 11, userSettings)
				session.settings = userSettings
				session.lang = session.settings.lang
				session.state = session.settings.state
			} else {
				// new user
				console.log('default.js, new user', 22)
				session.lang = app.defaultLang
				session.state = app.defaultState

				await services.saveUser(id)
					.catch(err => errLog(NAME, 'services.saveUser', err))
			}
		}

		console.log(id, 'app.runState', session.id)

		const res = await app.runState(id, session)
			.catch(err => errLog(NAME, 'app.runState', err))

		console.log(NAME, 'after await app.runState(id)')

		return res
	}
}

module.exports = async(opts) => {
	return new Menu(opts)
}
