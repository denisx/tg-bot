const NAME = 'settings.js'

class Menu {
	constructor() {
		console.log(NAME, 'constructor - menu/settings')

		// const id = opts.id
		// const app = opts.app
		// const session = app.session[id]

		// const lang = session.set.lang
		// const state = session.set.state
		// const ctx = session.ctx

		console.log(NAME, 'settings file')

		// app.send(id, {
		// 	ctx,
		// 	type: 'sendMessage',
		// 	data: texts.getFrameText(lang, state)
		// })

		// console.log('settings.js', state)

		// session.set.stateOld = session.set.state
		// session.set.state = 'chooseLang'
		// app.runState(id)
	}
}

module.exports = (opts) => {
	return new Menu(opts)
}
