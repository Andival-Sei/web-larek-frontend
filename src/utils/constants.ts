export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

// Централизованный объект для всех селекторов и id шаблонов
export const settings = {
	modal: {
		container: '#modal-container',
		content: '.modal__content',
		close: '.modal__close',
	},
	page: {
		wrapper: '.page__wrapper',
		catalog: '.gallery',
		basket: '.header__basket',
		basketCounter: '.header__basket-counter',
	},
	card: {
		title: '.card__title',
		price: '.card__price',
		image: '.card__image',
		category: '.card__category',
		description: '.card__text',
		button: '.card__button',
		deleteButton: '.basket__item-delete',
		index: '.basket__item-index',
	},
	basket: {
		list: '.basket__list',
		price: '.basket__price',
		button: '.basket__button',
	},
	form: {
		submit: 'button[type=submit]',
		errors: '.form__errors',
		input: '.form__input',
	},
	success: {
		close: '.order-success__close',
		total: '.order-success__description',
	},
	templates: {
		cardCatalog: '#card-catalog',
		cardPreview: '#card-preview',
		cardBasket: '#card-basket',
		basket: '#basket',
		order: '#order',
		contacts: '#contacts',
		success: '#success',
	},
};
