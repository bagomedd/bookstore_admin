CREATE TABLE
    Publishers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        publisher_name VARCHAR(255) NOT NULL,
        contract_start_date DATE NOT NULL,
        contract_end_date DATE NOT NULL,
        total_turnover NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
        total_books INTEGER NOT NULL DEFAULT 0
    );

CREATE TABLE
    Editions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        publisher_id UUID NOT NULL,
        author VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        copies_sold INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT fk_publisher FOREIGN KEY (publisher_id) REFERENCES Publishers (id) ON DELETE CASCADE
    );

INSERT INTO
    Publishers (
        id,
        publisher_name,
        contract_start_date,
        contract_end_date,
        total_turnover,
        total_books
    )
VALUES
    (
        '5466c1f4-1f03-4145-97b2-6ebcd54b1b58',
        'Эксмо',
        '2023-01-15',
        '2028-01-14',
        12000.00,
        45
    ),
    (
        'fd646a21-8f36-4303-b96e-ccfdfffabc13',
        'АСТ',
        '2024-05-20',
        '2029-05-19',
        50000.00,
        22
    ),
    (
        '53a87821-7843-42df-841b-466036eae741',
        'МИФ',
        '2022-11-01',
        '2027-10-31',
        12000.00,
        12
    );

INSERT INTO
    Editions (
        id,
        publisher_id,
        author,
        title,
        price,
        copies_sold
    )
VALUES
    (
        'abbb5262-bd44-4f48-aba4-09e9aa8e6415',
        '5466c1f4-1f03-4145-97b2-6ebcd54b1b58',
        'Стивен Кинг',
        'Оно',
        1200.00,
        1
    ),
    (
        '5b6c2288-4fe4-4aca-9971-4521481c9f35',
        '5466c1f4-1f03-4145-97b2-6ebcd54b1b58',
        'Сомерсет Моэм',
        'Бремя страстей человеческих',
        450.50,
        12
    ),
    (
        'c19a600b-ed71-43e6-8212-00fd87231df2',
        'fd646a21-8f36-4303-b96e-ccfdfffabc13',
        'Джордж Оруэлл',
        '1984',
        850.00,
        0
    ),
    (
        '4dbbeb9f-f671-46c2-ac81-80ef62349584',
        'fd646a21-8f36-4303-b96e-ccfdfffabc13',
        'Жан Поль Сартр',
        'Тошнота',
        300.00,
        3
    ),
    (
        '36be0014-c164-4470-871b-dbd0462a0afa',
        '53a87821-7843-42df-841b-466036eae741',
        'Энтони Бёрджесс',
        'Заводной апельсин',
        1500.00,
        10
    );