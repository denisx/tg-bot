function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on mobileToAuto', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'back'
	switch (menu.command) {
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)
		case 'back':
			menu.path = 'autoMenu'
			menu.dropCommand = true
			return self.parseText(id)
			break
		default:
			var mobile = self.services.filterMobile(menu.userText)
			if (mobile) {
				return self.services.saveMobile({
					id: menu.msg.from.id,
					menu: menu,
					phoneNumber: mobile,
					toNumber: menu.numberObj.numberId
				})
					.then(() => {
						menu.answer = menu.texts.mobileSaveText + ' +' + mobile + ' ' +
							menu.texts.forNumber + ' ' + menu.numberObj.number
						menu.noNextQueue = true
						self.commandAnswer(id)

						menu.path = 'autoMenu'
						menu.dropCommand = true
						return self.parseText(id)
					})
					.catch((err) => {
						console.error(self.services.getDT(), id, 'saveMobile', 'err', err)
						menu.path = 'autoMenu'
						menu.dropCommand = true
						return self.parseText(id)
					})
			} else {
				menu.answer += menu.texts.mobileToAutoText + ' ' + menu.numberObj.number +
					menu.texts.vars.newLine + menu.texts.writeMobileDo
			}
	}
	self.commandAnswer(id)
}

module.exports = f
