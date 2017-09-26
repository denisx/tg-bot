class Lang {
	constructor() {
		return {
			ru: 'Русский',
			en: 'English',
			hiText: 'Привет!',
			startText: 'Какой будет опрос?',
			likeType: 'Быстрый ${emoji.star}',
			pollType: 'Обычный',
			lang: 'Язык',
			settings: 'Настройки',
			enterQuestion: 'Напишите первый вопрос:',
			groupText: 'en: Please, enter${br}ru: Пожалуйста, перейдите в${br}@${botName}',
			chooseLang: 'Выберите язык${br}Choose language',
			saveLangOK: 'Настройки сохранены - ${lang}',
			startKeyboard: 'В начало',
			likes: '${emoji.star}${emoji.star}${emoji.star}${emoji.star}${emoji.star}',
			nbsp: '${nbsp}',
			likesText: 'Понравился бот? ${emoji.robot_face} Ставьте пять!${br}' +
				'1. Перейдите в бот <a href="https://t.me/storebot?start=${botName}">@StoreBot</a>${br}' +
				'2. Нажмите там <i>Start</i>${br}' +
				'3. Поставьте оценку${br}' +
				'Спасибо! ${emoji.star}${emoji.star}${emoji.star}${emoji.star}${emoji.star}',
			// noLang: '...',
			// cantParseNumber: 'Не распознал номер. ${emoji.warning} Попробуйте ещё раз:',
			// error: 'Что-то пошло не так. ${emoji.space_invader} Попробуйте позже.',
			// noLPphoto: 'Нет фото. ${emoji.camera} Добавить на сайте ${LPsite}',
			// addNewLPphoto: 'Добавить новое фото ${emoji.camera} на сайте ${LPsite}',
			// carLPpage: 'на сайте',
			// antiparkonLinkText: 'Чат по номеру авто или узнать мобильный @AntiParkon_bot',
			//
			// leftNav: '${emoji.arrow_left}',
			// middleNav: '${text}',
			// rightNav: '${emoji.arrow_right}',
			// emptyNav: '\u200C',
			//
			// addToNote: 'Записать в блокнот ${emoji.ledger}',
			// addToGarage: 'Добавить в гараж ${emoji.house_with_garden}',
			// addedToNote: 'Записано в блокнот', // ${emoji.ledger} ${emoji.white_check_mark}
			// addedToGarage: 'Добавлено в гараж', // ${emoji.house_with_garden} ${emoji.white_check_mark}
			// addedToNoteAlready: 'Номер записан в блокнот',
			// addedToGarageAlready: 'Номер добавлен в гараж',

			dtFormat: '${day} ${month} ${year}',
			months: [
				'Январь',
				'Февраль',
				'Март',
				'Апрель',
				'Май',
				'Июнь',
				'Июль',
				'Август',
				'Сентябрь',
				'Октябрь',
				'Ноябрь',
				'Декабрь'],
			monthsTo: [
				'Января',
				'Февраля',
				'Марта',
				'Апреля',
				'Мая',
				'Июня',
				'Июля',
				'Августа',
				'Сентября',
				'Октября',
				'Ноября',
				'Декабря']
		}
	}
}

module.exports = (opts) => {
	return new Lang(opts)
}

// https://github.com/OneSignal/emoji-picker
