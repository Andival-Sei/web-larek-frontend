// Типы и интерфейсы для заказа
import type { IBasketItem } from './basket';
import type { IEventEmitter } from './common';

/**
 * Возможные способы оплаты заказа
 */
export type PaymentMethod = 'online' | 'cash';

/**
 * Контактная информация покупателя
 */
export interface IContactInfo {
	/** Email покупателя */
	email: string;
	/** Телефон покупателя */
	phone: string;
}

/**
 * Информация о доставке заказа
 */
export interface IDeliveryInfo {
	/** Адрес доставки */
	address: string;
	/** Способ оплаты */
	payment: PaymentMethod;
}

/**
 * Полная информация о заказе
 */
export interface IOrder {
	/** Список товаров в заказе */
	items: IBasketItem[];
	/** Общая стоимость заказа */
	total: number;
	/** Данные о доставке */
	delivery: IDeliveryInfo;
	/** Контактные данные покупателя */
	contacts: IContactInfo;
}

/**
 * Запрос на создание заказа (как отправляется на сервер)
 */
export interface IOrderRequest {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[]; // массив ID товаров
}

/**
 * Ответ сервера на создание заказа
 */
export interface IOrderResponse {
	id: string;
	total: number;
}

/**
 * Интерфейс модели заказа
 */
export interface IOrderModel {
	/** Создать заказ */
	createOrder(orderData: IOrderRequest): Promise<IOrderResponse>;
	/** Получить текущий заказ */
	getCurrentOrder(): IOrder | null;
	/** Очистить текущий заказ */
	clearOrder(): void;
}

/**
 * Интерфейс конструктора модели заказа
 */
export interface IOrderModelConstructor {
	new (events: IEventEmitter): IOrderModel;
}