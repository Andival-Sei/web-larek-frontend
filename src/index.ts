import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/api/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Модели данных
import { CatalogModel } from './models/CatalogModel';
import { BasketModel } from './models/BasketModel';
import { OrderModel } from './models/OrderModel';

// Компоненты отображения
import { Page } from './views/Page';
import { Modal } from './views/Modal';
import { Card } from './views/Card';
import { Basket } from './views/Basket';
import { OrderForm } from './views/OrderForm';
import { ContactsForm } from './views/ContactsForm';
import { Success } from './views/Success';

// Типы
import { IProduct, IContactsForm, IOrderForm } from './types';

// Глобальные объекты
const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модели данных
const catalogModel = new CatalogModel({}, events);
const basketModel = new BasketModel({}, events);
const orderModel = new OrderModel({}, events);

// Глобальные компоненты
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Дальше запишем обработчики событий

// Изменения элементов каталога
events.on('items:changed', () => {
	page.catalog = catalogModel.items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Открыть товар
events.on('card:select', (item: IProduct) => {
	catalogModel.setPreview(item);
});

// Изменен открытый выбранный товар
events.on('preview:changed', (item: IProduct) => {
	const showItem = (item: IProduct) => {
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (basketModel.contains(item.id)) {
					modal.close();
					events.emit('basket:open');
				} else {
					events.emit('card:add', item);
				}
			},
		});

		modal.render({
			content: card.render({
				id: item.id,
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
				description: item.description,
				button: basketModel.contains(item.id) ? 'В корзину' : 'Купить',
			}),
		});
	};

	if (item) {
		api
			.getProduct(item.id)
			.then(showItem)
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

// Добавить товар в корзину
events.on('card:add', (item: IProduct) => {
	basketModel.add(item);
	// Обновляем модальное окно если товар сейчас отображается
	if (catalogModel.getPreview()?.id === item.id) {
		events.emit('preview:changed', item);
	}
});

// Убрать товар из корзины
events.on('card:remove', (item: IProduct) => {
	basketModel.remove(item.id);
});

// Изменения в корзине
events.on('basket:changed', () => {
	page.counter = basketModel.getCount();
	basket.items = basketModel.getItems().map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:remove', item);
			},
		});
		const element = card.render({
			id: item.id,
			title: item.title,
			price: item.price,
		});

		// Устанавливаем индекс товара в корзине
		const indexElement = element.querySelector('.basket__item-index');
		if (indexElement) {
			indexElement.textContent = String(index + 1);
		}

		return element;
	});

	basket.total = basketModel.getTotal();
	basket.buttonDisabled = basketModel.getCount() === 0;
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы заказа
events.on(
	'formErrors:change',
	(errors: Partial<IOrderForm & IContactsForm>) => {
		const { payment, address, email, phone } = errors;
		orderForm.valid = !payment && !address;
		orderForm.errors = Object.values({ payment, address })
			.filter((i) => !!i)
			.join('; ');
		contactsForm.valid = !email && !phone;
		contactsForm.errors = Object.values({ phone, email })
			.filter((i) => !!i)
			.join('; ');
	}
);

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		orderModel.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		orderModel.setContactsField(data.field, data.value);
	}
);

// Отправлена форма заказа
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Отправлена форма контактов
events.on('contacts:submit', () => {
	orderModel.setOrderData(basketModel.getItemIds(), basketModel.getTotal());
	api
		.createOrder(orderModel.getOrderData())
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: result.total,
				}),
			});

			basketModel.clear();
			orderModel.clearOrder();
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера
api
	.getProductList()
	.then(catalogModel.setItems.bind(catalogModel))
	.catch((err) => {
		console.error(err);
	});
