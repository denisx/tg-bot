function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on eva', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'eva'
	switch (menu.command) {
		case 'back':
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)

		case 'seeEva':
			menu.path = 'seeEva'
			menu.dropCommand = true
			return self.parseText(id)

		case 'findEva':
			menu.path = 'findEva'
			menu.dropCommand = true
			return self.parseText(id)

		default:
			menu.answer = menu.texts.evaText()
			self.commandAnswer(id)
	}
}

module.exports = f
