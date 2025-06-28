// Интерфейс API-клиента и типы ответов

/**
 * Поддерживаемые HTTP-методы для API
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Универсальный тип ответа от API для списков
 */
export interface IApiResponse<T> {
	/** Общее количество элементов */
	total: number;
	/** Массив элементов */
	items: T[];
}

/**
 * Интерфейс клиента для работы с API
 */
export interface IApiClient {
	/** Выполнить GET-запрос */
	get<T>(uri: string): Promise<T>;
	/** Выполнить POST/PUT/DELETE-запрос */
	post<T>(uri: string, data: object, method?: HttpMethod): Promise<T>;
}

/**
 * Ошибка API
 */
export interface IApiError {
    error: string;
}