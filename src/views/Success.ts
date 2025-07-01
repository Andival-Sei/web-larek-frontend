import { Component } from '../components/base/Component';
import { ISuccess, ISuccessActions } from '../types';
import { ensureElement } from '../utils/utils';

export class Success extends Component<ISuccess> {
	protected _close: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	/**
	 * Установить общую стоимость заказа
	 */
	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
