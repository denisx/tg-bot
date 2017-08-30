function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on garage')
	menu.answer = ''
	menu.keyboardPath = 'garage'
	switch (menu.command) {
		case 'back':
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)

		case 'newNumber':
			menu.path = 'newNumber'
			menu.dropCommand = true
			return self.parseText(id)

		case 'settings':
			menu.path = 'settings'
			menu.dropCommand = true
			return self.parseText(id)

		default:
			let userInputNumber
			if (menu.userText.length > 2 && menu.userText[0] == 'n' && menu.userText[1] == '_') {
				userInputNumber = menu.userText.replace(/^(?:n_)?([a-zа-яё0-9]+)$/i, '$1').toUpperCase()
			}
	}
}

module.exports = f
