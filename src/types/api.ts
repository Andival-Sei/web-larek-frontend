import type { IProduct } from './product';
import type { IOrder, IOrderResult } from './order';

export interface IWebLarekAPI {
	/** Получить каталог товаров */
	getProductList(): Promise<IProduct[]>;
	/** Получить товар по id */
	getProduct(id: string): Promise<IProduct>;
	/** Создать заказ */
	createOrder(order: IOrder): Promise<IOrderResult>;
}
