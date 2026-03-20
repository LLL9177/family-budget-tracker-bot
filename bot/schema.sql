DROP TABLE IF EXISTS user;

CREATE TABLE user (
    user_id INTEGER PRIMARY KEY,
    family_id UUID NOT NULL,
    telegram_id INTEGER NOT NULL UNIQUE,
    server_uid UUID NOT NULL UNIQUE,
    password TEXT NOT NULL,
    access TEXT,
    refresh TEXT
)