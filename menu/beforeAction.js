console.log('menu/before action')

const services = global.services

function f(id) {
	const menu = this.menu[id]

	if (!menu) {
		console.error(services.getDT(), 'id=', id, 'no menu')

		return
	}

	if (!menu.msg) {
		console.error(services.getDT(), id, 'no menu.msg')

		return
	}

	if (!menu.hasSession) {
		menu.hasSession = true

		services.saveUser({
			id: menu.msg.from.id,
			menu
		})
			.catch((err) => {
				console.error(services.getDT(), id, 'saveUser', 'err', err)
			})

		menu.hasBanned = false

		services.getBanned({
			userId: menu.msg.from.id,
			menu
		})
			.then((row) => {
				self.menu[id].hasBanned = (row && row.banned)
			})
			.catch((err) => {
				console.error(services.getDT(), 'getBanned', 'err', err)
			})
	}

	if (!menu.hasMobileAuth) {
		menu.hasMobileAuth = false

		services.getMobileAuth({
			id: menu.msg.from.id,
			menu
		})
			.then((result) => {
				self.menu[id].hasMobileAuth = (result)
			})
			.catch((err) => {
				console.error(services.getDT(), id, 'getMobileAuth', 'err', err)
			})
	}

	if (menu.msg.contact && menu.msg.contact.phone_number &&
		menu.msg.contact.user_id === menu.msg.from.id) {
		const phone = menu.msg.contact.phone_number.toString().replace(/^\+?(\d+)$/, '$1')

		services.saveMobile({
			id: menu.msg.from.id,
			menu,
			phoneNumber: phone,
			own: true
		})
			.then((result) => {
				self.menu[id].hasMobileAuth = (result)
			})
			.catch((err) => {
				console.error(services.getDT(), 'saveMobile', 'err', err)
			})
	}

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
