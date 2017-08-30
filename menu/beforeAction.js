function f (id) {
	var self = this
	// self.botName = botName
	// console.log(999, self.dt === self.services.getDT)

	// if (!self.onStartDone) {
	// 	self.onStartDone = true
		// self.services.onStart(self)
		// self.services.onStart()
	// }

	var menu = self.menu[id]
	if (!menu) {
		console.error(self.services.getDT(), 'id=', id, 'no menu')
		return
	}
	if (!menu.msg) {
		console.error(self.services.getDT(), id, 'no menu.msg')
		return
	}
	if (!menu.hasSession) {
		menu.hasSession = true
		let botKey = 0
		switch (self.botName) {
			case 'Antiparkon':
				botKey = 1
				break
			case 'Avinfocar':
				botKey = 2
				break
			case 'MotorChat':
				botKey = 3
				break
		}
		self.services.saveUser({
				id: menu.msg.from.id,
				menu: menu,
				botKey: botKey
			})
			.catch((err) => {
				console.error(self.services.getDT(), id, 'saveUser', 'err', err)
			})
		menu.hasBanned = false
		self.services.getBanned({
			userId: menu.msg.from.id,
			menu: menu
		})
		/**
		 * @param {Object} row
		 * @param {int} row.banned
		 */
			.then((row) => {
				self.menu[id].hasBanned = (row && row.banned)
			})
			.catch((err) => {
				console.error(self.services.getDT(), 'getBanned', 'err', query, err)
			})

	}
	if (!menu.hasMobileAuth) {
		menu.hasMobileAuth = false
		self.services.getMobileAuth({
				id: menu.msg.from.id,
				menu: menu
			})
			.then((result) => {
				self.menu[id].hasMobileAuth = (result)
			})
			.catch((err) => {
				console.error(self.services.getDT(), id, 'getMobileAuth', 'err', err)
			})
	}
	if (menu.msg.contact && menu.msg.contact.phone_number && menu.msg.contact.user_id == menu.msg.from.id) {

		let phone = menu.msg.contact.phone_number.toString().replace(/^\+?(\d+)$/, '$1')
		self.services.saveMobile({
				id: menu.msg.from.id,
				menu: menu,
				phoneNumber: phone,
				own: true
			})
			.then((result) => {
				self.menu[id].hasMobileAuth = (result)
			})
			.catch((err) => {
				console.error(self.services.getDT(), 'saveMobile', 'err', err)
			})
	}
	// console.log(3, menu.hasBanned, id)
	if (menu.hasBanned) {
		// console.log(4)
		menu.answer = '--- === YOU ARE BANNED *<;] --- === \n'
		menu.path = 'start'
		menu.keyboardPath = 'start'
		menu.dropCommand = true
		menu.dropUserText = true
	}
}

module.exports = f
