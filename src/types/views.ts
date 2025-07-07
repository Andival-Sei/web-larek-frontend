import type { CategoryType, IProduct } from './product';

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

// Данные, требуемые карточке: большинство полей берём из IProduct,
// добавляя специфическое для UI поле `button`.
export type ICard = Pick<IProduct, 'id' | 'title' | 'price'> &
	Partial<Pick<IProduct, 'image' | 'category' | 'description'>> & {
		button?: string;
	};

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
