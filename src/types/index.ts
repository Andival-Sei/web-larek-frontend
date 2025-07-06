// Базовые типы данных

// Категории товаров
export type CategoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Способы оплаты
export type PaymentMethod = 'cash' | 'online';

// Товар из API
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number | null;
}

// Список товаров из API
export interface IProductList {
	total: number;
	items: IProduct[];
}

// Данные формы заказа (первый шаг)
export interface IOrderForm {
	payment: PaymentMethod;
	address: string;
}

// Данные формы контактов (второй шаг)
export interface IContactsForm {
	email: string;
	phone: string;
}

// Полные данные заказа для отправки на сервер
export interface IOrder extends IOrderForm, IContactsForm {
	total: number;
	items: string[];
}

// Результат создания заказа
export interface IOrderResult {
	id: string;
	total: number;
}

// Элемент корзины
export interface IBasketItem {
	id: string;
	title: string;
	price: number;
}

// Состояние корзины
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

// Ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейсы для моделей данных

export interface ICatalogModel {
	items: IProduct[];
	preview: string | null;
	loading: boolean;
	setItems(items: IProduct[]): void;
	getProduct(id: string): IProduct | undefined;
	setPreview(product: IProduct): void;
}

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

export interface IOrderModel {
	order: IOrder;
	formErrors: FormErrors;
	setOrderField(field: keyof IOrderForm, value: string): void;
	setContactsField(field: keyof IContactsForm, value: string): void;
	validateOrder(): boolean;
	validateContacts(): boolean;
	clearOrder(): void;
}

// Интерфейсы для API

export interface IWebLarekAPI {
	getProductList(): Promise<IProduct[]>;
	getProduct(id: string): Promise<IProduct>;
	createOrder(order: IOrder): Promise<IOrderResult>;
}

// Интерфейсы для компонентов отображения

export interface IComponent<T> {
	render(data?: T): HTMLElement;
}

export interface IModal {
	content: HTMLElement;
	open(): void;
	close(): void;
	render(data: IModalData): HTMLElement;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	id: string;
	title: string;
	image?: string;
	price: number | null;
	category?: CategoryType;
	description?: string;
	button?: string;
}

export interface IBasketCardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IForm {
	valid: boolean;
	errors: string[];
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

// События приложения
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

export * from './product';
export * from './basket';
export * from './order';
export * from './events';
export * from './api';
export * from './common';
export * from './views';
