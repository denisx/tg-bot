console.log('menu/default')

const services = global.services

class Menu {
	constructor(opts) {
		this.init(opts)
	}

	async init(opts) {
		const app = opts.app
		const session = opts.session
		const id = session.id

		if (session && session.ping) {
			console.log(services.getDT(), id, 'user at session, state')
			session.ping = new Date()
			app.runState(session)
		} else {
			console.log(services.getDT(), id, 'no session, search at base')
			session.ping = new Date()

			const userSettings = await services.getSettings(id)[0]

			if (userSettings) {
				// find a user
				console.log(11, userSettings)
				Object.assign(session, userSettings)
			} else {
				// new user
				console.log(22, userSettings)
				session.lang = app.defaultLang
				session.state = app.defaultState

				await services.saveUser(id)
			}
		}

		app.runState(session)
	}
}

module.exports = (opts) => {
	return new Menu(opts)
}
