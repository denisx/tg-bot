function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on action', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'action'
	switch (menu.command) {
		case 'back':
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)

		case 'eva':
			menu.path = 'seeEva'
			menu.dropCommand = true
			return self.parseText(id)

		case 'awesome':
			menu.path = 'seeAwesomeInputGeo'
			menu.eventStatus = {
				type: 'awesome',
				subType: 'def'
			}
			menu.dropCommand = true
			return self.parseText(id)

		default:
			menu.answer = menu.texts.actionText()
			self.commandAnswer(id)
	}
}

module.exports = f
