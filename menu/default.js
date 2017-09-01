console.log('menu/default')

class Menu {
	constructor(opts) {
		console.log('constructor - menu/default')

		this.init(opts)
	}

	async init({ id, app }) {
		const session = app.sessions[id]
		console.log(id, session)

		if (session && session.ping) {
			console.log(app.services.getDT(), id, 'user at session, state')
			session.ping = new Date()
			app.runState(session)
		} else {
			console.log(app.services.getDT(), id, 'no session, search at base')
			session.ping = new Date()

			const userSettings = await app.services.getSettings(id)[0]

			if (userSettings) {
				// find a user
				console.log(11, userSettings)
				Object.assign(session, userSettings)
			} else {
				// new user
				console.log(22, userSettings)
				session.lang = app.defaultLang
				session.state = app.defaultState

				await app.services.saveUser(id)
			}
		}

		app.runState(session)
	}
}

module.exports = (opts) => {
	return new Menu(opts)
}
