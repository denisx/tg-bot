const NAME = 'chooseLang.js'

class Menu {
	constructor (opts) {
		DEV && console.log(NAME)
		const id = opts.id
		const app = opts.app
		const session = app.session[id]

		// delete session.priority

		let saveDefault
		if (!session.lang) {
			session.lang = app.defaultLang
			saveDefault = true
		}

		let lang = session.lang
		const state = session.state
		const ctx = session.ctx

		const userInput = session.userInput

		if (saveDefault) {
			services.saveLang(id, app)
				.catch(err => errLog('chooseLang.js, save default lang', lang, err))
				.then(() => {
					console.log('save default', lang)
				})
		}

		const textFrame = texts.getFrameText(lang, state)
		const cbq = ctx.update.callback_query

		if (cbq) {
			if (menu.checkInlineAccepted(state, cbq.data)) {
				lang = session.lang = cbq.data
				// save lang
				console.log(122)
				services.saveLang(id, app)
					.then(() => {
						console.log(123, 'send feedback')
						DEV && log(NAME, 'getText', lang)
						app.send(id, {
							ctx,
							type: 'sendMessage',
							data: texts.getText(lang, 'saveLangOK', {lang: texts.getText(lang, lang)})
						})
						session.dropUserText = true
						session.state = 'start'
						app.runState(id)
					})
					.catch(err => {
						console.log(124)
						errLog('chooseLang.js, save new lang', lang, err)})
			} else {
				errLog('chooseLang', 'unknown callback', cbq.data)
			}
		} else {
			if (userInput.text && !menu.checkCommand(userInput.command)) {
				session.stateOld = session.state
				session.state = 'start'
				app.runState(id)
			} else {
				app.send(id, {
					ctx,
					type: 'sendMessage',
					data: textFrame
				})
			}
		}
	}
}

module.exports = (opts) => {
	return new Menu(opts)
}

// /start
// /help
// /settings
// /stop
// /commands
