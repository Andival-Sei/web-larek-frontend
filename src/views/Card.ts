import { Component } from '../components/base/Component';
import { CategoryType, ICard, ICardActions } from '../types';
import { ensureElement } from '../utils/utils';

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._category = container.querySelector('.card__category');
		this._description = container.querySelector('.card__text');
		this._button =
			container.querySelector('.card__button') ||
			container.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	/**
	 * Установить ID карточки
	 */
	set id(value: string) {
		this.container.dataset.id = value;
	}

	/**
	 * Получить ID карточки
	 */
	get id(): string {
		return this.container.dataset.id || '';
	}

	/**
	 * Установить заголовок
	 */
	set title(value: string) {
		this.setText(this._title, value);
	}

	/**
	 * Получить заголовок
	 */
	get title(): string {
		return this._title.textContent || '';
	}

	/**
	 * Установить изображение
	 */
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	/**
	 * Установить цену
	 */
	set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button && !value) {
			this.setDisabled(this._button, true);
		}
	}

	/**
	 * Установить категорию
	 */
	set category(value: CategoryType) {
		this.setText(this._category, value);
		this.toggleClass(
			this._category,
			'card__category_soft',
			value === 'софт-скил'
		);
		this.toggleClass(
			this._category,
			'card__category_other',
			value === 'другое'
		);
		this.toggleClass(
			this._category,
			'card__category_additional',
			value === 'дополнительное'
		);
		this.toggleClass(
			this._category,
			'card__category_button',
			value === 'кнопка'
		);
		this.toggleClass(
			this._category,
			'card__category_hard',
			value === 'хард-скил'
		);
	}

	/**
	 * Установить описание
	 */
	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descriptionItem = this._description.cloneNode() as HTMLElement;
					this.setText(descriptionItem, str);
					return descriptionItem;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	/**
	 * Установить текст кнопки
	 */
	set button(value: string) {
		this.setText(this._button, value);
	}

	/**
	 * Заблокировать кнопку
	 */
	set buttonDisabled(value: boolean) {
		this.setDisabled(this._button, value);
	}
}
