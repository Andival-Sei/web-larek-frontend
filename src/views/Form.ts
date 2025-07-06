import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/events';
import { IForm } from '../types';
import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

export class Form<T> extends Component<IForm> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			settings.form.submit,
			this.container
		);
		this._errors = ensureElement<HTMLElement>(
			settings.form.errors,
			this.container
		);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	/**
	 * Обработчик изменения поля формы
	 */
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	/**
	 * Установить валидность формы
	 */
	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	/**
	 * Установить ошибки валидации
	 */
	set errors(list: string[]) {
		this.setText(this._errors, list.join('; '));
	}

	/**
	 * Рендер формы
	 */
	render(state: Partial<T> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
