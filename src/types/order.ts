// Типы, относящиеся к оформлению заказа

export type PaymentMethod = 'cash' | 'online';

// Шаг 1: информация о доставке
export interface IOrderForm {
	payment: PaymentMethod | null;
	address: string;
}

// Шаг 2: контактные данные
export interface IContactsForm {
	email: string;
	phone: string;
}

// Полная структура заказа, отправляемая на сервер
export interface IOrder extends IOrderForm, IContactsForm {
	total: number;
	items: string[]; // массив id товаров
}

// Ответ сервера о созданном заказе
export interface IOrderResult {
	id: string;
	total: number;
}

// Ошибки формы (key -> сообщение)
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс модели заказа (business-logic layer)
export interface IOrderModel {
	order: IOrder;
	formErrors: FormErrors;
	setField(
		field: keyof (IOrderForm & IContactsForm),
		value: string | PaymentMethod
	): void;
	// validateOrder и validateContacts убраны; валидация выполняется внутри setField.
	clearOrder(): void;
}
