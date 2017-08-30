function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log('on newNumber', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'newNumber'
	switch (menu.command) {
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)
		case 'back':
			menu.path = 'start'
			menu.dropUserText = true
			menu.dropCommand = true
			return self.parseText(id)
		case 'myAuto':
			menu.whoseAuto = 'my'
			menu.path = 'inputNumber'
			menu.dropCommand = true
			return self.parseText(id)
		case 'notMyAuto':
			menu.whoseAuto = 'notMy'
			menu.path = 'inputNumber'
			menu.dropCommand = true
			return self.parseText(id)
		default:
			menu.answer += menu.texts.newNumberInfo()
	}
	self.commandAnswer(id)
}

module.exports = f
