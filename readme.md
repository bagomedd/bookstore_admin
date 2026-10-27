# Система управления книжными поставками


## Быстрый запуск:
### Через Docker (для Linux):
``` bash
git clone https://github.com/bagomedd/bookstore_admin
cd bookstore_admin

# Создать .env с таким содержимым (одна команда):
cat << 'EOF' > .env
DB_HOST="db"
DB_PORT=5432
DB_NAME="bookstore_db"
DB_USERNAME="admin"
DB_PASSWORD="admin"
EOF

sudo docker compose build
sudo docker compose up
```

### Быстрый запуск без докера не предусмотрен из-за необходимости созавать бд

## Описание
Система управления поставками для книжного магазина. Бизнес модель упрощена.

Приложение представляет собой клиент с двумя таблицами с возможностью фильтрации, поиска, CRUD. Клиент взаимодействует с бэкендом, который общается с бд. Приложение обёрнуто в докер и используется простейший nginx для маршрутизации.

## Стек:
- Frontend: React, TypeScript, Redux, RTK Query, React-Router, **AgGrid**, TailwindCSS, Material UI 5, Vite 
- Backend: Node.js, Express, PostgreSQL, pg-promise
- Архитектура: Docker, Nginx

## Описание Фронтенда
 
Клиент-часть приложения выполнена по архитектуре FSD. 

Приложение реализовано не по предоставленным шаблонам, потому что те - очень старые (самый свежий, который я нашёл обновился 2 года назад, а в среднем последние обновления - 3-5 лет назад), кроме того очень тяжеловесные и большие (более 10тыс. строк кода).

## Описание Бэкенда

Бэкенд очень простой - простая реализация CRUD для двух таблиц. Есть фильтры, сортировка, limit, offset.


## Описание БД:
#### Таблица Publishers
Поля:
- id:                   UUID        уникальный ID издательства (Первичный ключ)
- publisher_name:       VARCHAR     название издательства
- contract_start_date:  DATE        дата заключения договора
- contract_end_date:    DATE        дата конца договора
- total_turnover:       NUMERIC     общая выручка с продаж книг этого издателя
- total_books:          INTEGER     количество книг по контракту

#### Таблица Editions
Поля:
- id:                   UUID        уникальный ID издания (Первичный ключ)
- publisher_id:         UUID        ID издательства (Внешний ключ)
- author:               VARCHAR     ФИО автора
- title:                VARCHAR     название книги 
- last_supply_date:     DATE        дата последней поставки
- retail_price:         NUMERIC     розничная цена
- copies_sold:          INTEGER     количество проданных экземпляров

