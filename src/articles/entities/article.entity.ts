import { serial, text, integer } from 'drizzle-orm/pg-core';
import { users } from 'src/database/database-schema';

export const article = {
    id: serial('id').primaryKey(),
    title: text('title'),
    content: text('content'),
    authorId: integer('author_id').references(() => users.id),
};