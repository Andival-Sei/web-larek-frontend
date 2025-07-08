import { Model } from '../base/Model';
import { ICatalogModel, IProduct } from '../../types';
import { IEvents } from '../base/events';

export class CatalogModel
	extends Model<ICatalogModel>
	implements ICatalogModel
{
	private _items: IProduct[] = [];
	private _preview: string | null = null;
	private _loading = false;

	constructor(data: Partial<ICatalogModel>, events: IEvents) {
		super(data, events);
	}

	/**
	 * Установить товары в каталоге
	 */
	setItems(items: IProduct[]): void {
		this._items = items;
		this.emitChanges('items:changed', this._items);
	}

	/**
	 * Получить товар по ID
	 */
	getProduct(id: string): IProduct | undefined {
		return this._items.find((item) => item.id === id);
	}

	/**
	 * Установить товар для предварительного просмотра
	 */
	setPreview(product: IProduct): void {
		this._preview = product.id;
		this.emitChanges('preview:changed', product);
	}

	/**
	 * Получить товар для предварительного просмотра
	 */
	getPreview(): IProduct | null {
		if (!this._preview) return null;
		return this.getProduct(this._preview) || null;
	}

	/**
	 * Установить состояние загрузки
	 */
	setLoading(state: boolean): void {
		this._loading = state;
	}

	/** Получить все товары */
	getItems(): IProduct[] {
		return [...this._items];
	}

	/** Флаг загрузки */
	isLoading(): boolean {
		return this._loading;
	}
}
