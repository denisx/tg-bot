function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on numbers', menu.command)
	menu.answer = ''
	menu.keyboardPath = 'numbers'
	// menu.texts.botMenu.numbers

	switch (menu.command) {
		case 'back':
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)

		default:
			menu.answer = 'at numbers'
			self.commandAnswer(id)
	}
}

module.exports = f
