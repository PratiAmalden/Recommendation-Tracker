-- Drop tables if they exist to allow clean recreation during development
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    medium TEXT NOT NULL,
    recommender TEXT,
    mood TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
