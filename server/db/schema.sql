-- Drop tables in correct order due to foreign key dependencies
DROP TABLE IF EXISTS recommendation_moods;
DROP TABLE IF EXISTS moods;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create MOODS table
CREATE TABLE moods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    recommender TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (item_name, category, user_id)
);

-- Create RECOMMENDATION_MOODS junction table
CREATE TABLE recommendation_moods (
    recommendation_id INTEGER REFERENCES recommendations(id) ON DELETE CASCADE NOT NULL,
    mood_id INTEGER REFERENCES moods(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (recommendation_id, mood_id)
);


-- Insert moods
INSERT INTO moods (name) VALUES ('Happy') ON CONFLICT (name) DO NOTHING;
INSERT INTO moods (name) VALUES ('Sad') ON CONFLICT (name) DO NOTHING;
INSERT INTO moods (name) VALUES ('Excited') ON CONFLICT (name) DO NOTHING;
INSERT INTO moods (name) VALUES ('Calm') ON CONFLICT (name) DO NOTHING;