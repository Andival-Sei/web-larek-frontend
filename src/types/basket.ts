import type { IProduct } from './product';

// Элемент корзины – нужные для отображения поля товара
export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

// Структура данных, которую ожидает view корзины
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

// Интерфейс модели корзины
export interface IBasketModel {
	add(product: IProduct): void;
	remove(id: string): void;
	clear(): void;
	getTotal(): number;
	getCount(): number;
	contains(id: string): boolean;
	getItems(): IBasketItem[];
}
