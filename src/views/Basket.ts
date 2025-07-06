import { Component } from '../components/base/Component';
import { createElement, ensureElement } from '../utils/utils';
import { IEvents } from '../components/base/events';
import { IBasketView } from '../types';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._total = ensureElement<HTMLElement>('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
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
