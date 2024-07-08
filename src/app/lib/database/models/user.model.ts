import { connectToDatabase } from "@/supabaseMiddleware";

const createTableIfNotExists = async () => {
    const sql = `
      CREATE TABLE users_ss (
        id SERIAL PRIMARY KEY,
        clerk_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        photo TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        plan_id INTEGER DEFAULT 1,
        credit_balance INTEGER DEFAULT 10,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_movies_images_updated_at
        BEFORE UPDATE ON users_ss
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    const supabase = await connectToDatabase();

    const { error } = await supabase.rpc('execute_sql', { sql });

    if (error) {
        console.error('Error creating table:', error);
    } else {
        console.log('Table created or already exists');
    }
};

createTableIfNotExists()

