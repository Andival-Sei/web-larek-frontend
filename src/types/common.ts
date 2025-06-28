// Базовые и общие типы, утилиты и интерфейсы

import { IBasketState } from "./basket";
import { IOrder } from "./order";
import { IProduct } from "./product";

/**
 * Базовый интерфейс для сущностей с идентификатором
 */
export interface IEntity {
	/** Уникальный идентификатор */
	id: string;
}

/**
 * Интерфейс для событийного брокера (EventEmitter)
 */
export interface IEventEmitter {
	/** Вызвать событие */
	emit(event: string, data: unknown): void;
	/** Подписаться на событие */
	on(event: string, callback: (data: unknown) => void): void;
	/** Отписаться от события */
	off(event: string, callback: (data: unknown) => void): void;
}

/**
 * Базовый интерфейс для UI-компонентов
 */
export interface IComponent {
	/** Метод для рендера DOM-элемента */
	render(): HTMLElement;
	/** Метод для очистки ресурсов компонента */
	destroy(): void;
}

/**
 * Интерфейс для компонентов, поддерживающих события
 */
export interface IComponentEvents {
	/** Подписка на событие */
	on<T extends string>(event: T, callback: (data: unknown) => void): void;
	/** Вызов события */
	emit<T extends string>(event: T, data: unknown): void;
}

/**
 * Интерфейс для View-компонентов (визуальных представлений)
 */
export interface IView {
	/** Рендерит компонент с новыми данными */
	render(data?: object): HTMLElement;
}

/**
 * Интерфейс для конструктора View-компонентов
 */
export interface IViewConstructor {
	/** Создаёт новый экземпляр View */
	new (container: HTMLElement, events?: IEventEmitter): IView;
}

/**
 * Тип для селектора DOM-элемента (строка или сам элемент)
 */
export type SelectorElement<T> = T | string;

/**
 * Тип для коллекции селекторов DOM-элементов
 */
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

/**
 * Описание BEM-класса для стилизации
 */
export interface IBemClass {
	/** Имя класса */
	name: string;
	/** CSS-класс с точкой */
	class: string;
}

/**
 * Результат валидации поля
 */
export interface IValidationResult {
	/** Валидно ли поле */
	isValid: boolean;
	/** Список ошибок */
	errors: string[];
}

/**
 * Описание правила валидации
 */
export interface IValidationRule {
	/** Функция проверки */
	test: (value: string) => boolean;
	/** Сообщение об ошибке */
	message: string;
}

/**
 * Конфигурация приложения
 */
export interface IAppConfig {
	/** URL API */
	apiUrl: string;
	/** URL CDN */
	cdnUrl: string;
	/** Валюта */
	currency: string;
	/** Символ валюты */
	currencySymbol: string;
}

/**
 * Глобальное состояние приложения
 */
export interface IAppState {
	/** Список товаров */
	products: IProduct[];
	/** Состояние корзины */
	basket: IBasketState;
	/** Текущий заказ */
	currentOrder: IOrder | null;
	/** Флаг загрузки */
	isLoading: boolean;
	/** Сообщение об ошибке */
	error: string | null;
}
