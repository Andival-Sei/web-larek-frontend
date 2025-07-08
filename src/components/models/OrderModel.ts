import { Model } from '../base/Model';
import {
	FormErrors,
	IContactsForm,
	IOrder,
	IOrderForm,
	IOrderModel,
	PaymentMethod,
	IBasketModel,
} from '../../types';
import { IEvents } from '../base/events';

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
	 * Установить значение поля заказа
	 */
	setField(
		field: keyof (IOrderForm & IContactsForm),
		value: string | PaymentMethod
	): void {
		// Сохраняем значение в модели, приводя к корректному типу при необходимости
		if (field === 'payment') {
			this._orderForm[field] = value as PaymentMethod;
		} else {
			this._orderForm[field] = value as string;
		}

		// Валидируем все поля единым проходом, чтобы исключить перезапись ошибок
		const errors: typeof this.formErrors = {};

		// Проверка оплаты и адреса
		if (!this._orderForm.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this._orderForm.address) {
			errors.address = 'Необходимо указать адрес';
		}

		// Проверка контактов
		// По ТЗ требуется лишь факт заполнения поля
		if (!this._orderForm.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this._orderForm.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		// Определяем валидность частей формы
		const orderValid = !errors.payment && !errors.address;
		const contactsValid = !errors.email && !errors.phone;

		if (orderValid) {
			this.events.emit('order:ready', this.order);
		}
		if (contactsValid) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	// Методы validateOrder / validateContacts были удалены как неиспользуемые:
	// вся актуальная проверка выполняется при изменении полей в setField.

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