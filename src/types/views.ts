import type { CategoryType } from './product';

// Базовый UI-компонент
export interface IComponent<T> {
	render(data?: T): HTMLElement;
}

// Модальное окно
export interface IModalData {
	content: HTMLElement;
}

export interface IModal {
	content: HTMLElement;
	open(): void;
	close(): void;
	render(data: IModalData): HTMLElement;
}

// Главная страница
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Карточка товара
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

// Карточка товара в корзине
export interface IBasketCardActions {
	onClick: (event: MouseEvent) => void;
}

// Любая HTML-форма
export interface IForm {
	valid: boolean;
	errors: string[];
}

// Окно «Заказ оформлен»
export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}
