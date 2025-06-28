// Типы и интерфейсы для товаров

import { IEventEmitter } from "./common";

/**
 * Категории товаров, поддерживаемые в магазине
 */
export type ProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка';

/**
 * Интерфейс описывает структуру товара, получаемого с сервера
 */
export interface IProduct {
	/** Уникальный идентификатор товара */
	id: string;
	/** Название товара */
	title: string;
	/** Описание товара */
	description: string;
	/** Цена товара в синапсах */
	price: number | null;
	/** Категория товара */
	category: ProductCategory;
	/** Ссылка на изображение товара */
	image: string;
}

/**
 * Интерфейс модели каталога товаров
 */
export interface ICatalogModel {
	/** Список товаров в каталоге */
	items: IProduct[];
	/** Установить список товаров (после загрузки из API) */
	setItems(items: IProduct[]): void;
	/** Получить товар по ID */
	getProduct(id: string): IProduct | undefined;
	/** Получить все товары */
	getAllProducts(): IProduct[];
}

/**
 * Интерфейс конструктора модели каталога
 */
export interface ICatalogModelConstructor {
	new (events: IEventEmitter): ICatalogModel;
}