import { Form } from './Form';
import { IContactsForm } from '../../types';
import { IEvents } from '../base/events';

export class ContactsForm extends Form<IContactsForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this._phoneInput = container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
	}

	/**
	 * Установить email
	 */
	set email(value: string) {
		this._emailInput.value = value;
	}

	/**
	 * Установить телефон
	 */
	set phone(value: string) {
		this._phoneInput.value = value;
	}
}
