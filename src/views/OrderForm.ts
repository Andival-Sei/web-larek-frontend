import { Form } from './Form';
import { IOrderForm, PaymentMethod, IForm } from '../types';
import { IEvents } from '../components/base/events';
import { ensureAllElements } from '../utils/utils';

export class OrderForm extends Form<IOrderForm> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;
	private _currentPayment: PaymentMethod | null = null;

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
	 * Установить или сбросить способ оплаты.
	 * null – означает очистку выбора (новое оформление заказа).
	 */
	setPaymentMethod(method: PaymentMethod | null) {
		this._currentPayment = method;
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

	/**
	 * Переопределяем render, чтобы при повторном показе формы
	 * активная кнопка соответствовала состоянию модели
	 */
	render(state: Partial<IOrderForm> & IForm) {
		// вызываем базовый рендер для установки адреса/валидности/ошибок
		super.render(state);
		// Синхронизируем выделение способа оплаты:
		// 1) если в модель пришёл конкретный метод – показываем его
		// 2) если пришёл null – очищаем выбор
		// 3) иначе оставляем сохранённое значение (при повторных рендерах в рамках шага)
		if (state.payment === null) {
			this.setPaymentMethod(null);
		} else {
			this.setPaymentMethod(
				(state.payment ?? this._currentPayment) as PaymentMethod | null
			);
		}
		return this.container;
	}
}
