import { initAuthCreds, BufferJSON, proto } from '@whiskeysockets/baileys';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../backend/.env' });
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Ensure the table exists
const initDb = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS whatsapp_auth (
            id VARCHAR(255) PRIMARY KEY,
            data TEXT NOT NULL
        )
    `);
};

export const usePostgresAuthState = async (userId) => {
    await initDb();

    const writeData = async (data, id) => {
        const key = `${userId}-${id}`;
        const value = JSON.stringify(data, BufferJSON.replacer);
        await pool.query(
            'INSERT INTO whatsapp_auth (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data',
            [key, value]
        );
    };

    const readData = async (id) => {
        const key = `${userId}-${id}`;
        const res = await pool.query('SELECT data FROM whatsapp_auth WHERE id = $1', [key]);
        if (res.rows.length > 0) {
            return JSON.parse(res.rows[0].data, BufferJSON.reviver);
        }
        return null;
    };

    const removeData = async (id) => {
        const key = `${userId}-${id}`;
        await pool.query('DELETE FROM whatsapp_auth WHERE id = $1', [key]);
    };

    const creds = await readData('creds') || initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`);
                            if (type === 'app-state-sync-key' && value) {
                                value = proto.Message.AppStateSyncKeyData.create(value);
                            }
                            data[id] = value;
                        })
                    );
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            if (value) {
                                tasks.push(writeData(value, key));
                            } else {
                                tasks.push(removeData(key));
                            }
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: () => {
            return writeData(creds, 'creds');
        }
    };
};
