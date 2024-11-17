import { pgTable } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';
import { user } from 'src/users/entities/user.entity';
import { article } from 'src/articles/entities/article.entity'

export const users = pgTable('users', user);
export const articles = pgTable('articles', article)

// export const addresses = pgTable('addresses', {
//     id: serial('id').primaryKey(),
//     street: text('street'),
//     city: text('city'),
//     country: text('country'),
// });

// export const usersAddressesRelation = relations(users, ({ one }) => ({
//     address: one(addresses, {
//         fields: [users.addressId],
//         references: [addresses.id],
//     }),
// }));

export const databaseSchema = {
    users,
    articles,
    // addresses,
    // usersAddressesRelation,
};