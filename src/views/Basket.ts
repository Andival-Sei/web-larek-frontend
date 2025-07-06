import { Component } from '../components/base/Component';
import { createElement, ensureElement } from '../utils/utils';
import { IEvents } from '../components/base/events';
import { IBasketView } from '../types';
import { settings } from '../utils/constants';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>(settings.basket.list, container);
		this._total = ensureElement<HTMLElement>(settings.basket.price, container);
		this._button = ensureElement<HTMLButtonElement>(
			settings.basket.button,
			container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:open');
			});
		}

		this.items = [];
		this.buttonDisabled = true;
	}

	/**
	 * Установить список товаров в корзине
	 */
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	/**
	 * Установить общую стоимость
	 */
	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	/**
	 * Заблокировать кнопку оформления заказа
	 */
	set buttonDisabled(value: boolean) {
		this.setDisabled(this._button, value);
	}
}
