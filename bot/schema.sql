DROP TABLE IF EXISTS user;

CREATE TABLE user (
    user_id INTEGER PRIMARY KEY,
    family_id UUID NOT NULL,
    telegram_id INTEGER NOT NULL UNIQUE,
    server_uid UUID NOT NULL UNIQUE,
    password TEXT,
    one_time_password TEXT,
    access TEXT,
    refresh TEXT,
    CHECK ((password IS NOT NULL) <> (one_time_password IS NOT NULL))
)
