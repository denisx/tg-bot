function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on messages', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'messages'
	menu.selected = menu.selected || {}
	switch (menu.command) {
		case 'back':
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)
		case 'myMsg':
			menu.path = 'myMsg'
			menu.keyboardPath = 'MyMsg'
			menu.dropCommand = true
			return self.parseText(id)
		case 'msgToMe':
		default:
			menu.path = 'msgToMe'
			menu.keyboardPath = 'msgToMe'
			menu.dropCommand = true
			return self.parseText(id)
	}
}

module.exports = f
