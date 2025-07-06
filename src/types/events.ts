import type { IProduct } from './product';
import type { IBasketItem } from './basket';
import type { IOrder, IOrderForm, IContactsForm, IOrderResult } from './order';
import type { FormErrors } from './order';

export interface IAppEvents {
	'items:changed': IProduct[];
	'card:select': IProduct;
	'card:add': IProduct;
	'card:remove': IProduct;
	'basket:open': void;
	'basket:changed': IBasketItem[];
	'preview:changed': IProduct;
	'order:open': void;
	'order:submit': IOrder;
	'order.payment:change': IOrderForm;
	'order.address:change': IOrderForm;
	'contacts:submit': IOrder;
	'contacts.email:change': IContactsForm;
	'contacts.phone:change': IContactsForm;
	'formErrors:change': FormErrors;
	'modal:open': void;
	'modal:close': void;
	'order:success': IOrderResult;
	'order:ready': IOrder;
	'contacts:ready': IOrder;
}
