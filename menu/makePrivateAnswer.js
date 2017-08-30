function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on makePrivateAnswer', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'makePrivateAnswer'
	switch (menu.command) {
		case 'back':
			// delete menu.selected
			menu.path = 'messages'
			menu.dropCommand = true
			return self.parseText(id)
		case 'home':
			delete menu.selected
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)
		default:
			if (!menu.command && menu.userText) {
				self.services.saveMsg({
					id: menu.msg.from.id,
					replyMsgId: menu.selected.msg.id,
					toUserId: menu.selected.msg.user_id,
					text: menu.userText,
					evacuate: 0
				})
					.then((row) => {
						self.sendClearMessage({
							chatId: row.userId,
							fromId: row.userId,
							userText: menu.texts.youHavePrivateMsg + menu.texts.vars.newLine +
							row.userText
						})
					})
					.catch((err) => {
						console.error(self.getUserDT(), 'saveMsg', 'err', err)
					})

				menu.answer = menu.texts.saveOneMore +
					menu.texts.vars.newLine
				self.commandAnswer(id)
			} else {
				menu.answer = menu.texts.makePrivateAnswerText +
					menu.texts.vars.newLine
				self.commandAnswer(id)
			}
	}
}

module.exports = f
