import { Form } from './Form';
import { IOrderForm, PaymentMethod } from '../types';
import { IEvents } from '../components/base/events';
import { ensureAllElements } from '../utils/utils';

export class OrderForm extends Form<IOrderForm> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this._addressInput = container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.setPaymentMethod(button.name as PaymentMethod);
				this.onInputChange('payment', button.name);
			});
		});
	}

	/**
	 * Установить способ оплаты
	 */
	setPaymentMethod(method: PaymentMethod) {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === method);
		});
	}

	/**
	 * Установить адрес доставки
	 */
	set address(value: string) {
		this._addressInput.value = value;
	}

	/**
	 * Получить адрес доставки
	 */
	get address(): string {
		return this._addressInput.value;
	}
}
