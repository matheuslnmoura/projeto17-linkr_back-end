CREATE TABLE "users"(
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    user_name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()        
);

CREATE TABLE "posts"(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "users"("id"),
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),   
    is_deleted BOOLEAN NOT NULL DEFAULT false  
);

CREATE TABLE hashtags(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE post_hashtags(
    id SERIAL PRIMARY KEY,
    hashtag_id INTEGER NOT NULL REFERENCES "hashtags"("id"),
    post_id INTEGER NOT NULL REFERENCES "posts"("id"),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE likes(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "users"("id"),
    post_id INTEGER NOT NULL REFERENCES "posts"("id"),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

