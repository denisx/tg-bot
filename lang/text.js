// 1. get code: self.fixedCharCodeAt(msg.text, i)
// 2. use unicode helper: http://r12a.github.io/apps/conversion/

const { Extra, Markup } = require('node_modules/telegraf/lib')
const emoji = require('node-emoji').emoji

const NAME = 'text.js'

class Text {
	constructor (opts) {
		this.opts = opts
		this.abbr = {
			'ru': 1,
			'en': 1
		}
		this.text = {}
		Object.keys(this.abbr).forEach((lang) => {
			this.text[lang] = require(`./${lang}`)()
		})
		// this.line = '\r\n'
		this.emoji = emoji
	}
	getData (lang, abbr) {
		if (!lang) {
			return errLog('getData', 1, lang)
		}
		return this.text[lang][abbr]
	}
	getText (lang, abbr, rep) {
		if (!lang) {
			return errLog('getText', 1, lang)
		}
		let replace = Object.assign(this.opts, {lang}, rep)
		if (abbr) {
			let text = this.text[lang][abbr]
			if (text) {
				if (replace) {
					Object.keys(replace).forEach((key) => {
						const r = new RegExp(`\\$\{${key}\}`, 'g')
						text = text.replace(r, replace[key])
					})
				}
				text = text.replace(/(\$\{emoji\.)([a-z0-9_-]+)(\})/g, (s, s1, s2, s3) => {
					if (!emoji[s2]) {
						errLog('error emoji', s2)
					}
					return emoji[s2] || s2
				})
				return text
			} else {
				log('getText, noLang', lang, abbr)
				errLog('getText, noLang', lang, abbr)
				return abbr; //this.text[lang]['noLang']
			}
		} else {
			if (this.text[lang]) {
				return this.text[lang]
			}
		}
		return ''
	}
	getFrameText (lang, state) {
		const t = menu.get(state)
		// if (!t) {
		// 	return [[], []]
		// }
		// console.log(345, typeof t.webPreview, t.webPreview)
		const opts = {
			webPreview: (typeof t.webPreview === 'boolean') ? t.webPreview : true
		}

		let res = []

		let text = []
		if (typeof t.text === 'object') {
			t.text.forEach((el) => {
				DEV && log(NAME, 'getText', 2, lang)
				text.push(this.getText(lang, el))
			})
		} else {
			DEV && log(NAME, 'getText', 3, lang)
			text = this.getText(lang, t.text)
		}

		res.push(text)

		let inline = this.getInlineKeyboard(lang, t.inline)
		if (inline) {
			inline = this.markupAll(inline, opts)
			res.push(inline)
		}

		let keyboard = this.getKeyboard(lang, t.keyboard, opts)
		if (keyboard) {
			res.push(keyboard)
		}

		if (!keyboard && !inline && typeof opts.webPreview === 'boolean') {
			res.push(Extra.webPreview(false))
		}

		return res
	}
	getInlineKeyboard (lang, m) {
		if (!m) {
			return
		}
		let obj = []
		m.forEach((line) => {
			let objLine = []
			line.forEach((el) => {
				DEV && log(NAME, 'getText', 4, lang)
				objLine.push(this.inlineMarkup([
					this.getText(lang, el[0]),
					(typeof el[1] !== 'string') ? JSON.stringify(el[1]) : el[1]
				]))
			})
			obj.push(objLine)
		})
		return obj
	}
	getKeyboard (lang, m, opts = {}) {
		if (!m) {
			return
		}
		let obj = []
		m.forEach((line) => {
			let objLine = []
			line.forEach((el) => {
				if (typeof el === 'string' ) {
					DEV && log(NAME, 'getText', 5, lang)
					objLine.push(this.getText(lang, el))
				} else {
					DEV && log(NAME, 'getText', 6, lang)
					objLine.push(this.getText(lang, el[0]))
				}
			})
			obj.push(objLine)
		}); // Markup.keyboard(obj).resize().extra()
		return Extra.markup(Markup.keyboard(obj).resize()).webPreview(opts.webPreview)
	}
	inlineMarkup (m) {
		return Markup.callbackButton(m[0], m[1])
	}
	markupAll (m, opts = {}) {
		return Extra.webPreview(opts.webPreview).HTML().markup(Markup.inlineKeyboard(m))
	}
}

module.exports = (opts) => {
	if (!opts) {
		return errLog('menu', 'exports', 'no opts')
	}
	return new Text(opts)
}

// emoji
// https://www.npmjs.com/package/node-emoji
// https://github.com/iamcal/emoji-data
