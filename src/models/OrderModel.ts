import { Model } from '../components/base/Model';
import {
	FormErrors,
	IContactsForm,
	IOrder,
	IOrderForm,
	IOrderModel,
	PaymentMethod,
	IBasketModel,
} from '../types';
import { IEvents } from '../components/base/events';

export class OrderModel extends Model<IOrderModel> implements IOrderModel {
	// Поля, вводимые пользователем в различных формах (без total / items)
	private _orderForm: IOrderForm & IContactsForm = {
		payment: null,
		address: '',
		email: '',
		phone: '',
	};

	formErrors: FormErrors = {};

	constructor(
		data: Partial<IOrderModel>,
		events: IEvents,
		private basketModel: IBasketModel
	) {
		super(data, events);
	}

	// Актуальное состояние заказа. Сумма и список товаров рассчитываются
	// на основе BasketModel при каждом обращении.
	get order(): IOrder {
		return {
			...this._orderForm,
			total: this.basketModel.getTotal(),
			items: this.basketModel.getItems().map((i) => i.id),
		};
	}

	/**
	 * Установить поле формы заказа
	 */
	setOrderField(field: keyof IOrderForm, value: string): void {
		if (field === 'payment') {
			this._orderForm[field] = value as PaymentMethod;
		} else {
			this._orderForm[field] = value;
		}

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	/**
	 * Установить поле формы контактов
	 */
	setContactsField(field: keyof IContactsForm, value: string): void {
		this._orderForm[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	/**
	 * Валидация формы заказа (способ оплаты + адрес)
	 */
	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this._orderForm.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		if (!this._orderForm.address) {
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

		if (!this._orderForm.email) {
			errors.email = 'Необходимо указать email';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._orderForm.email)) {
			errors.email = 'Некорректный формат email';
		}

		if (!this._orderForm.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	/**
	 * Очистить заказ
	 */
	clearOrder(): void {
		this._orderForm = {
			payment: null,
			address: '',
			email: '',
			phone: '',
		};
		this.formErrors = {};
		this.events.emit('order:clear', this.order);
	}

	/**
	 * Получить заказ для отправки на сервер. Сумма и список товаров
	 * формируются динамически из модели корзины.
	 */
	getOrderData(): IOrder {
		return this.order; // геттер вернёт актуальное состояние
	}
}
