import { Component } from '../components/base/Component';
import { IModal, IModalData } from '../types';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

export class Modal extends Component<IModalData> implements IModal {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	/**
	 * Установить содержимое модального окна
	 */
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	/**
	 * Получить содержимое модального окна
	 */
	get content(): HTMLElement {
		return this._content;
	}

	/**
	 * Открыть модальное окно
	 */
	open(): void {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	/**
	 * Закрыть модальное окно
	 */
	close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = document.createElement('div');
		this.events.emit('modal:close');
	}

	/**
	 * Рендер модального окна с содержимым
	 */
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
