# Web-ларёк

Интернет-магазин магических товаров для веб-разработчиков. Проект реализован на **TypeScript** по паттерну **MVP** с событийным обменом. Пользователь может просмотреть каталог, положить товары в корзину и оформить заказ в два шага.

---

## 1. Используемый стек

| Цель | Технология |
|------|------------|
| Язык / типизация | **TypeScript 5** |
| Сборка | **Webpack 5**, `ts-loader`, `sass-loader` |
| Стили | **SCSS** + **PostCSS** (`autoprefixer`) |
| UI | HTML 5, семантические теги, flex / grid |
| Линтинг | **ESLint**, **Prettier** |

Дополнительные пакеты перечислены в `package.json`.

---

## 2. Быстрый старт

1. Клонируйте репозиторий и установите зависимости

```bash
npm i
```

2. Создайте файл окружения `.env` в корне проекта с содержимым:

```dotenv
API_ORIGIN=https://larek-api.nomoreparties.co
```

3. Запустите режим разработки с hot-reload

```bash
npm run start
```

4. Соберите production-версию

```bash
npm run build
```

5. Полезные скрипты

* `npm run lint` — проверка ESLint;
* `npm run lint:fix` — авто-исправление;
* `npm run format` — форматирование Prettier.

---

## 3. Архитектура проекта

Проект разбит на три логических слоя: **Модели (Model)**, **Представления (View)** и **Презентер (Presenter)**. Связь между слоями осуществляется через общий **EventEmitter** – брокер событий, что обеспечивает слабое связывание и упрощает тестирование.

```
┌─────────┐     ui:click      ┌──────────────┐      model:changed      ┌────────────┐
│  View   │ ───────────────▶ │  Presenter   │ ──────────────────────▶ │   Model    │
└─────────┘ ◀─────────────── └──────────────┘ ◀────────────────────── └────────────┘
             render/update                         load / mutate
```

### 3.1 Базовые классы

| Класс | Расположение | Назначение |
|-------|--------------|------------|
| `EventEmitter` | `src/components/base/events.ts` | Регистрирует/снимает слушателей, рассылает события, передавая полезную нагрузку. |
| `Model<T>` | `src/components/base/Model.ts` | Абстрактная модель-обёртка поверх данных типа `T`. Предоставляет метод `emitChanges`, автоматически микширует `Partial<T>` в `this`. |
| `Component<P>` | `src/components/base/Component.ts` | Базовый класс представления: хранит ссылку на DOM-контейнер, умеет устанавливать текст, атрибуты, классы, изображения и реагировать на изм. свойств. |
| `WebLarekAPI` | `src/components/api/WebLarekAPI.ts` | Инкапсулирует HTTP-запросы (`fetch`). Методы: `getProductList`, `getProduct`, `createOrder`. |

### 3.2 Модели данных

| Класс | Описание |
|-------|----------|
| `CatalogModel` | Держит массив товаров, полученных из API. Предоставляет метод `getProduct(id)` для быстрого доступа к товару. |
| `BasketModel` | Хранит Map товаров, добавленных в корзину, считает итоговую сумму и количество. |
| `OrderModel` | Содержит промежуточные данные заказа (доставка, контакты), валидирует формы и формирует итоговый объект заказа. |

#### 3.2.1 CatalogModel — каталог товаров

* **Назначение**: единственный источник информации о загруженных товарах каталога, а также о выбранном пользователем товаре для предварительного просмотра.
* **Наследование**: `extends Model<ICatalogModel>`.
* **Конструктор**: `(data: Partial<ICatalogModel>, events: IEvents)`
  * `data` — начальное состояние (может быть пустым).
  * `events` — экземпляр брокера событий для взаимодействия с другими слоями.
* **Поля**
  * `_items: IProduct[]` — актуальный список товаров.
  * `_preview: string \| null` — `id` товара, выбранного для превью, либо `null`.
  * `_loading: boolean` — индикатор загрузки каталога.
* **Методы**
  * `setItems(items: IProduct[]): void` — сохраняет массив товаров и эмитит `items:changed`.
  * `getItems(): IProduct[]` — возвращает копию массива `_items`.
  * `getProduct(id: string): IProduct \| undefined` — ищет товар по `id`.
  * `setPreview(product: IProduct): void` — устанавливает текущий товар-превью и эмитит `preview:changed`.
  * `getPreview(): IProduct \| null` — возвращает объект товара для превью или `null`.
  * `setLoading(state: boolean): void` — меняет флаг загрузки.
  * `isLoading(): boolean` — текущий статус загрузки.

#### 3.2.2 BasketModel — корзина покупателя

* **Назначение**: управляет набором выбранных товаров и предоставляет агрегированные данные (количество, сумма).
* **Наследование**: `extends Model<IBasketModel>`.
* **Конструктор**: `(data: Partial<IBasketModel>, events: IEvents)`.
* **Поля**
  * `_items: Map<string, IBasketItem>` — коллекция позиций в корзине, ключ — `id` товара.
* **Методы**
  * `add(product: IProduct): void` — кладёт товар в корзину и эмитит `basket:changed`.
  * `remove(id: string): void` — убирает товар и эмитит `basket:changed`.
  * `clear(): void` — очищает корзину.
  * `getItems(): IBasketItem[]` — массив позиций корзины.
  * `getCount(): number` — количество товаров.
  * `getTotal(): number` — суммарная стоимость.
  * `contains(id: string): boolean` — проверка наличия товара.

#### 3.2.3 OrderModel — оформление заказа

* **Назначение**: хранит данные, введённые в формах оплаты и контактов, выполняет валидацию и формирует финальный объект `IOrder` на основании данных корзины.
* **Наследование**: `extends Model<IOrderModel>`.
* **Конструктор**: `(data: Partial<IOrderModel>, events: IEvents, basketModel: IBasketModel)`
  * `basketModel` передаётся для вычисления суммы и списка товаров — таким образом, стоимость и состав заказа **не дублируются**, а вычисляются на лету (SSOT).
* **Поля**
  * `_orderForm: IOrderForm & IContactsForm` — промежуточные данные, введённые пользователем.
  * `formErrors: FormErrors` — объект текущих ошибок валидации.
* **Геттеры**
  * `order: IOrder` — актуальный объект заказа, собирается из `_orderForm` и `basketModel`.
* **Методы**
  * `setField(field, value): void` — обновляет любое поле заказа (способ оплаты, адрес, email, телефон) и автоматически проводит валидацию всех полей. При изменении эмитит события `formErrors:change`, а при успешной валидации частей формы — `order:ready` или `contacts:ready`.
  * `clearOrder(): void` — сбрасывает данные заказа и эмитит `order:clear`.
  * `getOrderData(): IOrder` — возвращает финальный объект для API.

### 3.3 Представления (View-компоненты)

| Компонент | Файл | Функция |
|-----------|------|---------|
| `Card` | `src/components/views/Card.ts` | Карточка товара. Отображает инфо, выводит кнопку «Купить» / «Убрать». |
| `Basket` | `src/components/views/Basket.ts` | Список товаров в корзине + сумма + кнопка «Оформить». |
| `Modal` | `src/components/views/Modal.ts` | Универсальное модальное окно с анимацией и оверлеем. Закрывается по Esc, крестику, оверлею. |
| `Form` (базовый) | `src/components/views/Form.ts` | Общая логика форм: сбор данных, валидация, блокировка кнопок. |
| `OrderForm` | `src/components/views/OrderForm.ts` | Шаг 1: выбор оплаты + ввод адреса. |
| `ContactsForm` | `src/components/views/ContactsForm.ts` | Шаг 2: почта + телефон. |
| `Success` | `src/components/views/Success.ts` | Модалка успешной покупки. |
| `Page` | `src/components/views/Page.ts` | Шапка + основной контейнер. Отображает счётчик корзины. |

#### 3.3.1 Card — карточка товара

* **Наследование**: `extends Component<ICard>`
* **Конструктор**: `(container: HTMLElement, actions?: ICardActions)`
* **Сохраняемые элементы**
  * `_title` – заголовок товара (`h3`)
  * `_image` – картинка (`img`)
  * `_price` – цена (`span`)
  * `_category` – категория (`span`)
  * `_description` – описание (`p / li`)
  * `_button` – «В корзину» / «Убрать из корзины» (`button`)
* **Методы**: свойства устанавливаются через метод `render(data)`, который принимает объект с полями `id`, `title`, `image`, `price`, `category`, `description`, `button`.

#### 3.3.2 Basket — список корзины

* **Наследование**: `extends Component<IBasketView>`
* **Конструктор**: `(container: HTMLElement, events: IEvents)`
* **Сохраняемые элементы**
  * `_list` – контейнер для позиций корзины (`ul`)
  * `_total` – сумма заказа (`span`)
  * `_button` – кнопка «Оформить» (`button`)
* **Методы/сетторы**: `items`, `total`, `buttonDisabled`.

#### 3.3.3 Modal — всплывающее окно

* **Наследование**: `extends Component<IModalData>`
* **Конструктор**: `(container: HTMLElement, events: IEvents)`
* **Сохраняемые элементы**
  * `_closeButton` – крестик закрытия (`button`)
  * `_content` – область контента (`div`)
* **Методы**: `content`, `open`, `close`, `render`.

#### 3.3.4 Form (базовый класс)

* **Наследование**: `extends Component<IForm>`
* **Конструктор**: `(container: HTMLFormElement, events: IEvents)`
* **Сохраняемые элементы**
  * `_submit` – кнопка отправки формы (`button`)
  * `_errors` – блок ошибок валидации (`div` / `span`)
* **Методы**: `onInputChange`, `valid`, `errors`, `render`.

#### 3.3.5 OrderForm — выбор оплаты и адреса

* **Наследование**: `extends Form<IOrderForm>`
* **Конструктор**: `(container: HTMLFormElement, events: IEvents)`
* **Сохраняемые элементы**
  * `_paymentButtons` – массив кнопок способов оплаты (`button`)
  * `_addressInput` – поле адреса (`input`)
* **Методы**: `address`, `render` (переопределён для подсветки активной оплаты).

#### 3.3.6 ContactsForm — контактные данные

* **Наследование**: `extends Form<IContactsForm>`
* **Конструктор**: `(container: HTMLFormElement, events: IEvents)`
* **Сохраняемые элементы**
  * `_emailInput` – поле email (`input`)
  * `_phoneInput` – поле телефона (`input`)
* **Методы**: `email`, `phone`.

#### 3.3.7 Success — окно успешной оплаты

* **Наследование**: `extends Component<ISuccess>`
* **Конструктор**: `(container: HTMLElement, actions: ISuccessActions)`
* **Сохраняемые элементы**
  * `_close` – кнопка закрытия (`button`)
  * `_total` – сумма заказа (`span`)
* **Методы**: `total`.

#### 3.3.8 Page — обёртка страницы

* **Наследование**: `extends Component<IPage>`
* **Конструктор**: `(container: HTMLElement, events: IEvents)`
* **Сохраняемые элементы**
  * `_counter` – счётчик товаров в корзине (`span`)
  * `_catalog` – грид каталога (`section` / `div`)
  * `_wrapper` – обёртка контента (`div`)
  * `_basket` – иконка/кнопка корзины (`button` / `div`)
* **Методы/сетторы**: `counter`, `catalog`, `locked`.

### 3.4 Взаимодействие компонентов

1. Пользователь кликает по `Card` → `Card` через коллбэк вызывает `catalogModel.setPreview(item)`.
2. `CatalogModel` эмитит `preview:changed`, [Presenter в `src/index.ts`](./src/index.ts) ловит событие, создаёт превью товара с переданным объектом, вставляет его в контент `Modal` и открывает окно.
3. «В корзину» → через коллбэк вызывается `basketModel.add(item)`, который обновляет Map и эмитит `basket:changed`.
4. `Page` подписан на `basket:changed` и обновляет счётчик, `Basket` — перерисовывает список.
5. `OrderForm` и `ContactsForm` передают введённые значения в `OrderModel.setField()`. Модель валидирует данные и эмитит `formErrors:change`; Presenter реагирует на это событие и обновляет ошибки и активность кнопок форм.
6. `OrderModel` собирает финальный объект и отдаёт Presenter → `WebLarekAPI.createOrder()`.

---

## 4. Данные и типы

Все типы объявлены в `src/types`.

| Интерфейс | Назначение |
|-----------|------------|
| `IProduct` | Объект товара из API. |
| `ICard` | Данные, требуемые компоненту `Card`. |
| `IBasketItem` | Упрощённый товар в корзине. |
| `IOrderForm` / `IContactsForm` | Шаги формы заказа. |
| `IOrder` | Финальный объект, отправляемый `POST /order`. |
| `IAppEvents` | Интерфейс словаря строковых констант всех внутренних событий. |

Включена опция `noImplicitAny` для строгой типизации.

---

## 5. Процессы в приложении

1. **Загрузка каталога** – при инициализации Presenter (`src/index.ts`) вызывает `WebLarekAPI.getProductList()`, передаёт данные в `CatalogModel.setItems()`, которая эмитит `items:changed`.
2. **Добавление в корзину** – `BasketModel` изменяет Map, `Basket` и `Page` перерисовываются по событию `basket:changed`.
3. **Оформление** – две формы наследуют `Form`, обмен данными идёт через `OrderModel.setField()` с автоматической валидацией.
4. **Оплата** – `OrderModel` генерирует `IOrder`, API возвращает `id` + `total`, открывается `Success`.

Каждый шаг реализован через события; прямых ссылок Model ↔ View нет.

---

## 6. Структура репозитория

```
src/
├── components/            # базовые абстракции и api-клиент
│   ├── base/              # Component, Model, events
│   ├── api/               # WebLarekAPI
│   ├── models/            # бизнес-логика
│   └── views/             # UI-компоненты (только отрисовка)
├── types/                 # декларации TS-типов
├── utils/                 # утилиты и константы
├── scss/                  # стили + переменные
└── index.ts               # точка входа / Presenter
```

---

## 7. Размещение в сети

Рабочая версия проекта доступна по ссылке: [https://web-larek-frontend-xi.vercel.app/](https://web-larek-frontend-xi.vercel.app/)

---

Проект выполнен в рамках курса **«TypeScript и ООП» (Яндекс Практикум)**.