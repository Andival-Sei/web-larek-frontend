import type { IProduct } from './product';

// Элемент корзины (храним упрощённые данные, нужные для отображения)
export interface IBasketItem {
	id: string;
	title: string;
	price: number;
}

// Структура данных, которую ожидает view корзины
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

// Интерфейс модели корзины
export interface IBasketModel {
	items: Map<string, IBasketItem>;
	add(product: IProduct): void;
	remove(id: string): void;
	clear(): void;
	getTotal(): number;
	getCount(): number;
	contains(id: string): boolean;
	getItems(): IBasketItem[];
}
