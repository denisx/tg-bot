console.log('menu/choose lang')

const services = global.services
const errLog = global.errLog
const texts = global.texts
const menu = global.menu

class Menu {
	constructor(opts) {
		const id = opts.id
		const app = opts.app
		this.session = app.session[id]
		const session = this.session

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
				session.lang = cbq.data
				lang = session.lang
				// save lang
				console.log(122)
				services.saveLang(id, app)
					.then(() => {
						console.log(123, 'send feedback')
						app.send(id, {
							ctx,
							type: 'sendMessage',
							data: texts.getText(lang, 'saveLangOK', { lang: texts.getText(lang, lang) })
						})
						session.dropUserText = true
						session.state = 'start'
						app.runState(id)
					})
					.catch((err) => {
						errLog('chooseLang.js, save new lang', lang, err)
					})
			} else {
				errLog('chooseLang', 'unknown callback', cbq.data)
			}
		} else if (userInput.text && !menu.checkCommand(userInput.command)) {
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

module.exports = (opts) => {
	return new Menu(opts)
}
