import type { IProduct } from './product';
import type { IBasketItem } from './basket';
import type { IOrder, IOrderResult } from './order';
import type { FormErrors } from './order';

export interface IAppEvents {
	'items:changed': IProduct[];
	'basket:open': void;
	'basket:changed': IBasketItem[];
	'preview:changed': IProduct;
	'order:open': void;
	'formErrors:change': FormErrors;
	'modal:open': void;
	'modal:close': void;
	'order:ready': IOrder;
	'contacts:ready': IOrder;
}
