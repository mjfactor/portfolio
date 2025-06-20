import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { usersTable } from './schema/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
    const user: typeof usersTable.$inferInsert = {
        name: 'Johns32',
        age: 30,
        email: 'johns32@example.com',
    };

    await db.insert(usersTable).values(user);
    console.log('New user created!')

    // const users = await db.select().from(usersTable).where(eq(usersTable.id, 2));
    // console.log('Getting all users from the database: ', users)

    // await db
    //     .update(usersTable)
    //     .set({
    //         age: 31,
    //     })
    //     .where(eq(usersTable.email, user.email));
    // console.log('User info updated!')

    // await db.delete(usersTable).where(eq(usersTable.email, user.email));
    // console.log('User deleted!')
}

main();
