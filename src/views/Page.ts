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
	private _scrollY = 0;
	private _isLocked = false;

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
		if (value && !this._isLocked) {
			// Сохраняем текущий скролл и «замораживаем» позицию
			this._scrollY = window.scrollY;
			this._wrapper.style.top = `-${this._scrollY}px`;
			this.toggleClass(this._wrapper, 'page__wrapper_locked', true);
			this._isLocked = true;
		} else if (!value && this._isLocked) {
			// Восстанавливаем позицию
			const storedOffset = parseInt(this._wrapper.style.top || '0', 10);
			this._wrapper.style.removeProperty('top');
			this.toggleClass(this._wrapper, 'page__wrapper_locked', false);
			window.scrollTo(0, -storedOffset || this._scrollY);
			this._isLocked = false;
		}
	}
}
