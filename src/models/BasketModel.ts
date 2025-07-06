import { Model } from '../components/base/Model';
import { IBasketModel, IBasketItem, IProduct } from '../types';
import { IEvents } from '../components/base/events';

export class BasketModel extends Model<IBasketModel> implements IBasketModel {
	items: Map<string, IBasketItem> = new Map();

	constructor(data: Partial<IBasketModel>, events: IEvents) {
		super(data, events);
	}

	/**
	 * Добавить товар в корзину
	 */
	add(product: IProduct): void {
		if (product.price === null) {
			return; // Товары без цены нельзя добавлять в корзину
		}

		this.items.set(product.id, {
			id: product.id,
			title: product.title,
			price: product.price,
		});
		this.emitChanges('basket:changed', this.getItems());
	}

	/**
	 * Удалить товар из корзины
	 */
	remove(id: string): void {
		this.items.delete(id);
		this.emitChanges('basket:changed', this.getItems());
	}

	/**
	 * Очистить корзину
	 */
	clear(): void {
		this.items.clear();
		this.emitChanges('basket:changed', this.getItems());
	}

	/**
	 * Получить общую стоимость товаров в корзине
	 */
	getTotal(): number {
		return Array.from(this.items.values()).reduce(
			(total, item) => total + item.price,
			0
		);
	}

	/**
	 * Получить количество товаров в корзине
	 */
	getCount(): number {
		return this.items.size;
	}

	/**
	 * Проверить, содержится ли товар в корзине
	 */
	contains(id: string): boolean {
		return this.items.has(id);
	}

	/**
	 * Получить все товары в корзине
	 */
	getItems(): IBasketItem[] {
		return Array.from(this.items.values());
	}

	/**
	 * Получить список ID товаров в корзине
	 */
	getItemIds(): string[] {
		return Array.from(this.items.keys());
	}
}
