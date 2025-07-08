import { Form } from './Form';
import { IOrderForm, PaymentMethod, IForm } from '../types';
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
				// уведомляем презентер о выборе пользователя
				this.onInputChange('payment', button.name);
			});
		});
	}

	protected _highlightPayment(method: PaymentMethod | null) {
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
	 * Переопределяем render, чтобы при повторном показе формы
	 * активная кнопка соответствовала состоянию модели
	 */
	render(state: Partial<IOrderForm> & IForm) {
		// вызываем базовый рендер для установки адреса/валидности/ошибок
		super.render(state);

		// state.payment может быть undefined (при первом рендере)
		this._highlightPayment(state.payment ?? null);
		return this.container;
	}
}
