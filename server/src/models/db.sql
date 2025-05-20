CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL CHECK (char_length(password) >= 6),
    created DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL CHECK (char_length(text) < 500),
    user_id INTEGER REFERENCES users(id),
    created DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_follows (
    user_id INTEGER REFERENCES users(id),
    follows INTEGER REFERENCES users(id),
    created DATE DEFAULT CURRENT_TIMESTAMP
);
