// 1. get code: self.fixedCharCodeAt(msg.text, i)
// 2. use unicode helper: http://r12a.github.io/apps/conversion/

const { Extra, Markup } = require('telegraf/lib')
const emoji = require('node-emoji').emoji

const NAME = 'text.js'
const DEV = global.DEV || false

const errLog = global.errLog

class TextApp {
	constructor(opts) {
		DEV && console.log(NAME, 'TextApp() constructor', Object.keys(opts))

		this.opts = opts

		this.abbr = {
			ru: 1,
			en: 1
		}

		this.text = {}

		Object.keys(this.abbr).forEach((lang) => {
			// eslint-disable-next-line import/no-dynamic-require
			this.text[lang] = require(`./${lang}`)()
		})
		// this.line = '\r\n'
		this.emoji = emoji
	}
	// end constructor()

	setOpts({ menu }) {
		this.menu = menu
	}
	// end setOpts()

	getData(lang, abbr) {
		if (!lang) {
			return errLog('getData', 1, lang)
		}

		return this.text[lang][abbr]
	}
	// end getData()

	getText(lang, abbr, rep) {
		if (!lang) {
			return errLog('getText', 1, lang)
		}

		const replace = Object.assign(this.opts, { lang }, rep)

		if (abbr) {
			let text = this.text[lang][abbr]

			if (text) {
				if (replace) {
					Object.keys(replace).forEach((key) => {
						// const r = new RegExp(`\\$\{${key}\}`, 'g')
						const r = new RegExp(`\\$\{${key}}`, 'g')

						text = text.replace(r, replace[key])
					})
				}
				text = text.replace(/(\$\{emoji\.)([a-z0-9_-]+)(\})/g, (s, s1, s2) => {
					if (!emoji[s2]) {
						errLog(NAME, 'getText(), no', s2, 'at emoji[]')
					}

					return emoji[s2] || s2
				})

				return text
			}

			errLog('getText, noLang', lang, abbr)

			return abbr
		} else if (this.text[lang]) {
			return this.text[lang]
		}

		return ''
	}
	// end getText()

	getFrameTextBySession(session) {
		return this.getFrameText(session.lang, session.state)
	}
	// end getFrameTextBySession()

	getFrameText(lang, state) {
		if (!lang || !state) {
			return errLog(NAME, 'getFrameText, bad opts', `${lang} ${state}`)
		}

		const t = this.menu.get(state)

		const opts = {
			webPreview: (typeof t.webPreview === 'boolean') ? t.webPreview : true
		}

		const res = []
		let text = []

		if (typeof t.text === 'object') {
			t.text.forEach((el) => {
				text.push(this.getText(lang, el))
			})
		} else {
			text = this.getText(lang, t.text)
		}

		res.push(text)

		let inline = this.getInlineKeyboard(lang, t.inline)

		if (inline) {
			inline = this.markupAll(inline, opts)
			res.push(inline)
		}

		const keyboard = this.getKeyboard(lang, t.keyboard, opts)

		if (keyboard) {
			res.push(keyboard)
		}

		if (!keyboard && !inline && typeof opts.webPreview === 'boolean') {
			res.push(Extra.webPreview(false))
		}

		return res
	}
	// end getFrameText()

	getInlineKeyboard(lang, m) {
		if (!m) {
			return
		}

		const obj = []

		m.forEach((line) => {
			const objLine = []

			line.forEach((el) => {
				objLine.push(this.inlineMarkup([
					this.getText(lang, el[0]),
					(typeof el[1] !== 'string') ? JSON.stringify(el[1]) : el[1]
				]))
			})

			obj.push(objLine)
		})

		return obj
	}
	// end getInlineKeyboard()

	getKeyboard(lang, m, opts = {}) {
		if (!m) {
			return
		}

		const obj = []

		m.forEach((line) => {
			const objLine = []

			line.forEach((el) => {
				if (typeof el === 'string') {
					objLine.push(this.getText(lang, el))
				} else {
					objLine.push(this.getText(lang, el[0]))
				}
			})

			obj.push(objLine)
		})

		// Markup.keyboard(obj).resize().extra()
		return Extra.markup(Markup.keyboard(obj).resize()).webPreview(opts.webPreview)
	}
	// end getKeyboard()

	inlineMarkup(m) {
		return Markup.callbackButton(m[0], m[1])
	}
	// end inlineMarkup()

	markupAll(m, opts = {}) {
		return Extra
			.webPreview(opts.webPreview)
			.HTML() // eslint-disable-line new-cap
			.markup(Markup.inlineKeyboard(m))
	}
	// end markupAll()
}

module.exports = (opts) => {
	if (!opts) {
		return errLog('text.js', 'exports', 'no opts')
	}

	return new TextApp(opts)
}

// emoji
// https://www.npmjs.com/package/node-emoji
// https://github.com/iamcal/emoji-data
