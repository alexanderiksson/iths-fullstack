CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL CHECK (char_length(password) >= 6),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL CHECK (char_length(text) < 500),
    user_id INTEGER REFERENCES users(id),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_follows (
    user_id INTEGER REFERENCES users(id),
    follows INTEGER REFERENCES users(id),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, follows)
);

CREATE TABLE IF NOT EXISTS users_likes (
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS users_comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id),
    comment TEXT NOT NULL CHECK (char_length(comment) < 500),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
