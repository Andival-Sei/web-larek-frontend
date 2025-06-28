// Типы событий приложения
import type { IProduct } from './product';
import type { IBasketState } from './basket';
import type { IOrder } from './order';

/**
 * События, связанные с каталогом товаров
 */
export interface ICatalogEvents {
	/** Каталог товаров был обновлён */
	'catalog:changed': IProduct[];
	/** Пользователь выбрал товар */
	'product:selected': IProduct;
}

/**
 * События, связанные с корзиной
 */
export interface IBasketEvents {
	/** Состояние корзины изменилось */
	'basket:changed': IBasketState;
	/** Товар добавлен в корзину */
	'basket:add': IProduct;
	/** Товар удалён из корзины (по id) */
	'basket:remove': string; // product id
	/** Корзина очищена */
	'basket:clear': void;
}

/**
 * События, связанные с оформлением заказа
 */
export interface IOrderEvents {
	/** Отправка заказа */
	'order:submit': IOrder;
	/** Заказ успешно оформлен */
	'order:success': { orderId: string; total: number };
	/** Ошибка при оформлении заказа */
	'order:error': string;
}

/**
 * События, связанные с модальными окнами
 */
export interface IModalEvents {
	/** Открытие модального окна */
	'modal:open': { id: string; data?: unknown };
	/** Закрытие модального окна */
	'modal:close': { id: string };
}

/**
 * UI-события, генерируемые пользовательским интерфейсом
 */
export interface IUIEvents {
	/** Пользователь нажал "добавить в корзину" */
	'ui:basket-add': { id: string };
	/** Пользователь нажал "удалить из корзины" */
	'ui:basket-remove': { id: string };
	/** Пользователь выбрал товар */
	'ui:product-select': { id: string };
	/** Пользователь отправил заказ */
	'ui:order-submit': IOrder;
}

/**
 * Объединённый тип всех событий приложения
 */
export type AppEvents = ICatalogEvents &
	IBasketEvents &
	IOrderEvents &
	IModalEvents &
	IUIEvents;
