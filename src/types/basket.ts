// Типы и интерфейсы для корзины
import { IEventEmitter } from './common';
import type { IProduct } from './product';

/**
 * Описывает товар в корзине пользователя
 */
export interface IBasketItem {
	/** Объект товара */
	product: IProduct;
	/** Уникальный id позиции в корзине */
	itemId: string;
	/** Индекс для нумерации позиций в корзине */
	index: number;

	/** Количество данного товара в корзине */
	// quantity: number; Как я понял, это не нужно
}

/**
 * Состояние корзины пользователя
 */
export interface IBasketState {
	/** Список товаров в корзине */
	items: IBasketItem[];
	/** Общая стоимость всех товаров в корзине */
	total: number;
}

/**
 * Интерфейс модели корзины, реализующий логику хранения товаров через Map
 */
export interface IBasketModel {
	/** Массив id товаров в корзине (каждый товар может быть добавлен несколько раз) */
	items: string[];
	/** Добавить товар в корзину по id */
	add(id: string): void;
	/** Удалить товар из корзины по id */
	remove(id: string): void;
	/** Очистить корзину */
	clear(): void;
	/** Получить количество всех товаров */
	getCount(): number;
	/** Получить общую стоимость товаров */
	getTotal(): number;

	/** Map товаров в корзине (id товара -> количество) */
	// items: Map<string, number>; // Как я понял, это не нужно
}

/**
 * Интерфейс конструктора модели корзины
 */
export interface IBasketModelConstructor {
	new (events: IEventEmitter): IBasketModel;
}