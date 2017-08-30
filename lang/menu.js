const t = require('./menu')

const texts = global.texts
const errLog = global.errLog

class Menu {
	constructor(opts) {
		this.opts = opts
		this.commands = ['start']
		this.preLoad()
	}

	static get(name) {
		return t[name]
	}

	getCommands() {
		return this.commands
	}

	checkCommand(command) {
		return !!this.commands.filter(el => el === command).length
	}

	preLoad() {
		if (this.inited) {
			return errLog('menu.js', 'preLoad', 'already inited')
		}

		this.menu = {}
		const menu = this.menu

		Object.keys(t).filter(key => !t[key].noFile).forEach((key) => {
			menu[key] = require(`menu/${key}`) // eslint-disable-line import/no-dynamic-require
		})

		this.inited = true
	}

	getMenu(state) {
		if (!this.menu[state]) {
			return errLog('getMenu', 'nothing state =', state)
		}

		return this.menu[state]
	}

	checkInlineAccepted(state, abbr) {
		if (!t[state]) {
			return errLog('getAccepted', 'nothing state = ', state)
		}

		let accepted = false
		const inline = t[state].inline || []

		inline.forEach((line) => {
			line.forEach((el) => {
				if (!accepted && el[1] === abbr) {
					accepted = abbr
				}
			})
		})

		return accepted || ''
	}

	checkKeyboardAccepted(lang, state, text) {
		if (!t[state]) {
			return errLog('getAccepted', 'nothing state = ', state)
		}

		let accepted = false
		const inline = t[state].keyboard || []

		inline.forEach((line) => {
			line.forEach((el) => {
				if (!accepted) {
					if (typeof el === 'string') {
						if (text === texts.getText(lang, el)) {
							accepted = [el]
						}
					} else if (text === texts.getText(lang, el[0])) {
						accepted = el
					}
				}
			})
		})

		return accepted || []
	}
}

module.exports = (opts) => {
	if (!opts) {
		return errLog('menu', 'exports', 'no opts')
	}

	return new Menu(opts)
}
