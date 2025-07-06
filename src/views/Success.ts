import { Component } from '../components/base/Component';
import { ISuccess, ISuccessActions } from '../types';
import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

export class Success extends Component<ISuccess> {
	protected _close: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, protected actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			settings.success.close,
			container
		);
		this._total = ensureElement<HTMLElement>(settings.success.total, container);

		this._close.addEventListener('click', () => {
			this.actions.onClick();
		});
	}

	/**
	 * Установить общую стоимость заказа
	 */
	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
