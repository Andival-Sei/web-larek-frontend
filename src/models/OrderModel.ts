import { Model } from '../components/base/Model';
import {
	FormErrors,
	IContactsForm,
	IOrder,
	IOrderForm,
	IOrderModel,
	PaymentMethod,
} from '../types';
import { IEvents } from '../components/base/events';

export class OrderModel extends Model<IOrderModel> implements IOrderModel {
	order: IOrder = {
		payment: null,
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	formErrors: FormErrors = {};

	constructor(data: Partial<IOrderModel>, events: IEvents) {
		super(data, events);
	}

	/**
	 * Установить поле формы заказа
	 */
	setOrderField(field: keyof IOrderForm, value: string): void {
		if (field === 'payment') {
			this.order[field] = value as PaymentMethod;
		} else {
			this.order[field] = value;
		}

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	/**
	 * Установить поле формы контактов
	 */
	setContactsField(field: keyof IContactsForm, value: string): void {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	/**
	 * Валидация формы заказа (способ оплаты + адрес)
	 */
	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	/**
	 * Валидация формы контактов (email + телефон)
	 */
	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email)) {
			errors.email = 'Некорректный формат email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else {
			// Базовая проверка формата: +7 или 8 и 10 цифр с возможными пробелами/дефисами
			const phoneReg =
				/^((\+7|8)[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
			if (!phoneReg.test(this.order.phone)) {
				errors.phone = 'Некорректный формат телефона';
			}
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	/**
	 * Очистить заказ
	 */
	clearOrder(): void {
		this.order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
		this.formErrors = {};
		this.events.emit('order:clear', this.order);
	}

	/**
	 * Установить товары и общую стоимость заказа
	 */
	setOrderData(items: string[], total: number): void {
		this.order.items = items;
		this.order.total = total;
	}

	/**
	 * Получить заказ для отправки на сервер
	 */
	getOrderData(): IOrder {
		return { ...this.order };
	}
}
