import type { IProduct } from './product';
import type { IBasketState } from './basket';
import type { IOrder } from './order';
import type { IView } from './common';

/**
 * Интерфейс для карточки товара
 */
export interface IProductCardView extends IView {
	/** Рендерит карточку товара */
	render(data: { product: IProduct; inBasket: boolean }): HTMLElement;
}

/**
 * Интерфейс для модального окна товара
 */
export interface IProductModalView extends IView {
	/** Рендерит модальное окно с деталями товара */
	render(data: { product: IProduct; inBasket: boolean }): HTMLElement;
}

/**
 * Интерфейс для корзины
 */
export interface IBasketView extends IView {
	/** Рендерит корзину */
	render(data: IBasketState): HTMLElement;
}

/**
 * Интерфейс для формы заказа
 */
export interface IOrderFormView extends IView {
	/** Рендерит форму заказа */
	render(data: { step: 1 | 2; order?: Partial<IOrder> }): HTMLElement;
}

/**
 * Интерфейс для модального окна
 */
export interface IModalView extends IView {
	/** Рендерит модальное окно */
	render(data: {
		id: string;
		content: HTMLElement;
		title?: string;
	}): HTMLElement;
}
