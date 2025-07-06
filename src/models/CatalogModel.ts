import { Model } from '../components/base/Model';
import { ICatalogModel, IProduct } from '../types';
import { IEvents } from '../components/base/events';

export class CatalogModel
	extends Model<ICatalogModel>
	implements ICatalogModel
{
	items: IProduct[] = [];
	preview: string | null = null;
	loading = false;

	constructor(data: Partial<ICatalogModel>, events: IEvents) {
		super(data, events);
	}

	/**
	 * Установить товары в каталоге
	 */
	setItems(items: IProduct[]): void {
		this.items = items;
		this.emitChanges('items:changed', this.items);
	}

	/**
	 * Получить товар по ID
	 */
	getProduct(id: string): IProduct | undefined {
		return this.items.find((item) => item.id === id);
	}

	/**
	 * Установить товар для предварительного просмотра
	 */
	setPreview(product: IProduct): void {
		this.preview = product.id;
		this.emitChanges('preview:changed', product);
	}

	/**
	 * Получить товар для предварительного просмотра
	 */
	getPreview(): IProduct | null {
		if (!this.preview) return null;
		return this.getProduct(this.preview) || null;
	}

	/**
	 * Установить состояние загрузки
	 */
	setLoading(state: boolean): void {
		this.loading = state;
	}
}
