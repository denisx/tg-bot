/* rule for inline callbacks
 *
 * for button, make [lang abbr text, {callbacks} | callback text(? check it)]
 *
 * callbacks rule:
 * 	state	st: this.cbName
 * 	text	te: this.numberText
 * 	data	da: data
 *
 * for 64(? check here) symbols length
 */

/* rule for state without file (text only)
 *	noFile: 1
 */

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
		return this.commands.includes(command)
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

	checkKeyBoardAcceptedBySession(session) {
		if (!session.userInput || !session.userInput.text) {
			return ''
		}

		return this.checkKeyboardAccepted(session.lang, session.state, session.userInput.text)
	}

	checkKeyboardAccepted(lang, state, text) {
		if (!tree[state]) {
			return errLog('checkKeyboardAccepted', 'nothing state = ', state)
		}

		let accepted = false
		const keyboard = tree[state].keyboard || []

		keyboard.forEach((line) => {
			line.forEach((el) => {
				if (accepted) {
					return
				}

				if (typeof el === 'string') {
					if (text === this.texts.getText(lang, el)) {
						accepted = [el, el] // accepted = [el]
					}
				} else if (text === this.texts.getText(lang, el[0])) {
					accepted = el
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
