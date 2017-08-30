function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log('on lang', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'lang'
	switch (menu.command) {
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)
		case 'back':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)
		default:
			if (texts.langList[menu.command]) {
				menu.lang = menu.command
				menu.texts = texts[menu.lang]
				menu.changeLang = true
				self.services.saveLang({
					id: menu.msg.from.id,
					menu: menu
				})
				menu.path = 'start'
				menu.dropCommand = true
				return self.parseText(id)
			} else {
				menu.answer = menu.texts.langInfo
				menu.answer += texts.vars.newLine
				Object.keys(texts.langList).forEach((lang) => {
					menu.answer += 'start' + lang + texts.vars.newLine
				})
			}
	}
	self.commandAnswer(id)
}
module.exports = f
