const tree = require('./tree')

const NAME = 'menu.js'
const errLog = global.errLog
const DEV = global.DEV || false

class LangMenu {
	constructor(opts) {
		DEV && console.log(NAME, 'LangMenu() constructor', Object.keys(opts))

		this.opts = opts
		this.commands = ['start']
		this.texts = global.texts

		this.preLoad()
	}

	setOpts({ texts }) {
		this.texts = texts
	}

	get(name) {
		return tree[name]
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

		Object.keys(tree).filter(key => !tree[key].noFile).forEach((key) => {
			const path = `../menu/${key}`

			menu[key] = require(path) // eslint-disable-line import/no-dynamic-require
		})

		this.inited = true
	}

	getMenu(state) {
		if (!this.menu[state]) {
			return errLog('getMenu', 'nothing state =', state)
		}

		DEV && console.log(NAME, 'end getMenu()', state)
		return this.menu[state]
	}

	checkInlineAccepted(state, abbr) {
		if (!tree[state]) {
			return errLog('checkInlineAccepted', 'nothing state = ', state)
		}

		let accepted = false
		const inline = tree[state].inline || []

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
		if (!tree[state]) {
			return errLog('checkKeyboardAccepted', 'nothing state = ', state)
		}

		let accepted = false
		const inline = tree[state].keyboard || []

		inline.forEach((line) => {
			line.forEach((el) => {
				if (!accepted) {
					if (typeof el === 'string') {
						if (text === this.texts.getText(lang, el)) {
							accepted = [el]
						}
					} else if (text === this.texts.getText(lang, el[0])) {
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
		return errLog(NAME, 'exports', 'no opts')
	}

	return new LangMenu(opts)
}
