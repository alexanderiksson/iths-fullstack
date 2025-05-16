CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL CHECK (char_length(password) >= 6),
    created DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL CHECK (char_length(password) < 500),
    created DATE DEFAULT CURRENT_TIMESTAMP
)
