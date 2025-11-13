export interface Env {
    DB: D1Database;
}

// Ini adalah router sederhana. Untuk aplikasi besar, gunakan library seperti Hono atau itty-router.
export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        try {
             // Endpoint untuk Login
            if (url.pathname === '/api/login' && request.method === 'POST') {
                const { email, password } = await request.json();
                
                // Di dunia nyata, Anda akan menggunakan hashing & salt.
                // Untuk demo ini, kita hanya memeriksa email. Password diabaikan demi kesederhanaan.
                if (password !== 'password') {
                    return new Response(JSON.stringify({ error: 'Email atau password salah.' }), { status: 401 });
                }

                const stmt = env.DB.prepare('SELECT * FROM Users WHERE email = ?');
                const { results } = await stmt.bind(email).all();
                const user = results[0];

                if (user) {
                    return new Response(JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } });
                } else {
                    return new Response(JSON.stringify({ error: 'Email atau password salah.' }), { status: 401 });
                }
            }

            // Endpoint untuk mengambil semua ajuan
            if (url.pathname === '/api/ajuans' && request.method === 'GET') {
                // Anda bisa menambahkan parameter query untuk filter role, tipe, dll.
                const { results } = await env.DB.prepare('SELECT * FROM Ajuans ORDER BY createdAt DESC').all();
                return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
            }

            // Tambahkan endpoint lain di sini (getUsers, createAjuan, dll.)
            // ...

            return new Response('Endpoint tidak ditemukan', { status: 404 });

        } catch (e) {
            console.error(e);
            const error = e as Error;
            return new Response(error.message, { status: 500 });
        }
    },
};