const tree = require('./tree')

const texts = global.texts
const errLog = global.errLog

class Menu {
	constructor(opts) {
		this.opts = opts
		this.commands = ['start']
		this.preLoad()
	}

	static get(name) {
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

		console.log(4885, state)
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
