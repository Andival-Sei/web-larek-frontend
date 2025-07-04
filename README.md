# Проектная работа «Веб-ларёк»

## Описание проекта

Web-ларёк — это интернет-магазин товаров для веб-разработчиков, реализованный с использованием архитектурного паттерна MVP (Model-View-Presenter). Приложение позволяет просматривать каталог товаров, добавлять их в корзину и оформлять заказы.

## Используемый стек
- TypeScript
- SCSS
- Webpack
- HTML5
- ES6+

## Инструкция по запуску

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите проект в режиме разработки:
   ```bash
   npm run start
   ```
3. Для сборки проекта используйте:
   ```bash
   npm run build
   ```
4. В корне проекта создайте файл `.env` со строкой:
   ```
   API_ORIGIN=https://larek-api.nomoreparties.co
   ```
   ⚠️ **Важно**: Файл .env должен быть создан в корне проекта и содержать указанную переменную для корректной работы с API.

## Структура проекта

```
src/
├── components/          # Компоненты приложения (View, Presenter)
│   └── base/           # Базовые классы (EventEmitter, Api)
├── models/             # Модели данных (Model)
├── types/              # TypeScript типы и интерфейсы
├── utils/              # Утилиты и константы
├── scss/               # Стили
└── pages/              # HTML страницы
```

## Архитектура и описание классов

### MVP-архитектура
- **Model** — управляет данными и бизнес-логикой (например, товары, корзина, заказ).
- **View** — отвечает за отображение интерфейса (каталог, карточки товаров, корзина, формы).
- **Presenter** — связывает Model и View, обрабатывает пользовательские действия, обновляет View.

### Базовые классы
- **EventEmitter** — брокер событий для слабого связывания компонентов. Позволяет подписываться на события, снимать обработчики, инициировать события.
- **Api** — интерфейс для работы с серверным API (GET, POST, PUT, DELETE), обработка ответов и ошибок.

### Основные компоненты
- **ProductCard** — карточка товара в каталоге.
- **ProductModal** — модальное окно с подробной информацией о товаре.
- **Basket** — корзина покупок.
- **OrderForm** — форма оформления заказа (2 шага: доставка и контакты).
- **Modal** — базовый компонент модальных окон.

### Модели данных
- **ProductModel** — загрузка и хранение каталога товаров.
- **BasketModel** — управление состоянием корзины.
- **OrderModel** — оформление и валидация заказа.

### Взаимодействие компонентов
- Все взаимодействия реализованы через события с помощью EventEmitter.
- Примеры событий: `catalog:changed`, `product:selected`, `basket:change`, `order:submit`, `modal:open`, `ui:basket-add`, `ui:basket-remove` и др.
- Компоненты не имеют прямых связей друг с другом, взаимодействие происходит только через события.
- Модели данных генерируют события при изменении состояния.
- View-компоненты слушают события моделей и обновляют отображение.
- UI-события от пользователя передаются через EventEmitter в модели для обработки.

### Типы данных
- Типы и интерфейсы вынесены в отдельные файлы в папке `src/types/`.
- Описаны типы для товаров, корзины, заказа, событий, API и базовых классов.

### Принципы разработки
Проект следует ключевым принципам разработки ПО:

#### Изолированность
- Отдельные части системы могут использоваться как самостоятельные решения
- Базовые классы (EventEmitter, Api) не зависят от предметной области
- Компоненты можно переиспользовать в других проектах

#### Единственная ответственность 
- Каждый класс выполняет одну задачу (Single Responsibility Principle)
- Модели отвечают только за данные и бизнес-логику
- View-компоненты отвечают только за отображение
- EventEmitter отвечает только за события

#### Масштабируемость
- Архитектура позволяет легко добавлять новые компоненты
- Слабое связывание между слоями через события
- Типизация обеспечивает безопасное расширение функциональности

#### Дополнительные принципы
- Повторяющиеся части вынесены в утилиты
- Все данные строго типизированы
- Код организован в логические модули

## Пример описания класса

**EventEmitter** — класс для работы с событиями. Позволяет подписываться на события, снимать обработчики, инициировать события, слушать все события или сбрасывать все обработчики.

**Api** — класс для работы с серверным API. Позволяет выполнять HTTP-запросы, автоматически обрабатывает ответы и ошибки.

