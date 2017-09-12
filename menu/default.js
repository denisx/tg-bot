const NAME = 'default.js'
const DEV = global.DEV || false
const errLog = global.errLog

class Menu {
	constructor(opts) {
		DEV && console.log(NAME, 'Menu() constructor', Object.keys(opts))

		this.init(opts)
	}

	async init({ id, app }) {
		// const app = app.app
		const session = app.sessions[id]
		const services = app.services

		if (session && session.ping) {
			DEV && console.log(NAME, services.getDT(), id, 'user at session, state')
			session.ping = new Date()
		} else {
			DEV && console.log(NAME, services.getDT(), id, 'no session, search at base')
			session.ping = new Date()

			const userSettings = await services.getSettings(id)
				.catch(err => errLog(NAME, 'services.getSettings', err))

			if (userSettings) {
				// find a user
				DEV && console.log(NAME, 'find a user', 11, userSettings)
				session.settings = userSettings
				session.lang = session.settings.lang
				session.state = session.settings.state
			} else {
				// new user
				DEV && console.log(NAME, 'new user', 22)
				session.lang = app.defaultLang
				session.state = app.defaultState

				await services.saveUser(id)
					.catch(err => errLog(NAME, 'services.saveUser', err))
			}
		}

		DEV && console.log(NAME, id, 'init(), app.runState', session.id)

		const res = await app.runState(id, session)
			.catch(err => errLog(NAME, 'app.runState', err))

		DEV && console.log(NAME, 'end init()')

		return res
	}
}

module.exports = async(opts) => {
	return new Menu(opts)
}
