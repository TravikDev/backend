import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
// import { addresses } from "src/database/database-schema";

export const user = {
    id: serial('id').primaryKey(),
    username: text('username').unique(),
    password: text('password'),
    name: text('name').default('Guest'),
    refreshToken: text('refreshToken')
    // addressId: integer('address_id')
    //     .unique()
    //     .references(() => addresses.id),
}