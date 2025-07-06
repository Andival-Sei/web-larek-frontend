import { Component } from '../components/base/Component';
import { IPage } from '../types';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement(settings.page.basketCounter);
		this._catalog = ensureElement(settings.page.catalog);
		this._wrapper = ensureElement(settings.page.wrapper);
		this._basket = ensureElement(settings.page.basket);

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	/**
	 * Установить счетчик товаров в корзине
	 */
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	/**
	 * Установить каталог товаров
	 */
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	/**
	 * Заблокировать/разблокировать прокрутку страницы
	 */
	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
