const NAME = 'menu.js'

class Menu {
	constructor(opts) {
		this.opts = opts
		// this.app = opts.app
		this.t = {
			default: {},
			start: {
				text: ['start'],
				keyboard: [
					['likes']
				]
				// keyboard: [
				// 	[
				// 		['settings', 'chooseLang'],
						// 'likes'
					// ]
				// ]
			},
			chooseLang: {
				text: ['hi', 'chooseLang'],
				inline: [
					[
						['ru', 'ru'],
						['en', 'en']
					]
				],
				keyboard: [
					[
						['home', 'start']
					]
				]
			},
			settings: {},
			likes: {
				text: ['likesInfo'],
				noFile: 1,
				webPreview: false
			}
		}

		// high priority commands, exit from anywhere
		// this.commands = ['start', 'help', 'settings', 'stop']
		this.commands = ['start']

		this.preLoad()
	}
	get(name) {
		return this.t[name]
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
		const menu = this.menu = {}
		Object.keys(this.t).filter(key => !this.t[key].noFile).forEach((key) => {
			menu[key] = require(`menu/${key}`)
		})
		this.inited = true
	}
	getMenu (state) {
		if (!this.menu[state]) {
			return errLog('getMenu', 'nothing state =', state)
		}
		return this.menu[state]
	}
	checkInlineAccepted (state, abbr) {
		if (!this.t[state]) {
			return errLog('getAccepted', 'nothing state = ', state)
		}

		let accepted = false
		const inline = this.t[state].inline || []
		inline.forEach((line) => {
			line.forEach((el) => {
				if (!accepted && el[1] === abbr) {
					accepted = abbr
				}
			})
		})

		return (accepted) ? accepted : ''
	}

	checkKeyboardAccepted (lang, state, text) {
		if (!this.t[state]) {
			return errLog('getAccepted', 'nothing state = ', state)
		}
		let accepted = false
		const inline = this.t[state].keyboard || []
		inline.forEach((line) => {
			line.forEach((el) => {
				if (!accepted){
					if (typeof el === 'string') {
						DEV && log(NAME, 'getText', 1, lang, el)
						if (text === texts.getText(lang, el)) {
							accepted = [el]
						}
					} else {
						DEV && log(NAME, 'getText', 2, lang, el)
						if (text === texts.getText(lang, el[0])) {
							accepted = el
						}
					}
				}
			})
		})

		return (accepted) ? accepted : []
	}


	// start: [['newNumber', 'action'], ['messages'], ['garage', 'likes']], // 'lang',
		// 	lang: [['ru', 'en'], ['back', 'home']],
		// 	newNumber: [['notMyAuto', 'myAuto'], ['back', 'home']],
		// 	inputNumber: [['back', 'home']],
		// 	autoMenu: [['textToAuto'], ['mobileToAuto'], ['searchByNumber'], ['back', 'home']],
		// 	back: [['back', 'home']],
		// 	backSkip: [['skip'], ['back', 'home']],
		// 	messages: [['msgToMe'/*, 'myMsg'*/], ['back', 'home']],
		// 	msgToMe: [[ 'msgToMe'/*, 'myMsg'*/], ['back', 'home']],
		// 	myMsg: [['msgToMe'], ['back', 'home']],
		// 	makePrivateAnswer: [['back', 'home']],
		// 	garage: [['newNumber', 'settings'], ['back', 'home']],
		// 	removeNumber: [['removeNumber'], ['back', 'home']],
		// 	action: [['eva'], ['awesome'], ['back', 'home']],
		// 	eva: [['seeEva'], ['findEva'], ['back', 'home']],
		// 	seeEva: [['emptyEva'], ['waitForAuto'], ['shipAuto'], ['takeAway'], ['back', 'home']],
		// 	agree: [['yes', 'no'], ['back', 'home']],
		// 	numbers: [['otherNumbers', 'myNumbers'], ['back', 'home']],
		// 	myNumbers: [['back', 'home']]
}

module.exports = (opts) => {
	if (!opts) {
		return errLog('menu', 'exports', 'no opts')
	}
	return new Menu(opts)
}
