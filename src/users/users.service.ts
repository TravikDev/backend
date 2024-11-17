import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { databaseSchema } from 'src/database/database-schema';
import { PostgresErrorCode } from 'src/database/enum/postgres-error-code.enum';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { DrizzleService } from 'src/database/drizzle.service';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashValue, hashVerifyValue } from 'src/utils/hashing';
import { user } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    private readonly drizzleService: DrizzleService,
  ) { }

  async createUser(user: CreateUserDto) {
    const { username, password: cleanPassword } = user
    const password = hashValue(cleanPassword)

    return this.drizzleService.db.transaction(async (transaction) => {
      try {
        const createdUsers = await transaction
          .insert(databaseSchema.users)
          .values({ username, password })
          .returning();

        console.log('createdUsers: ', createdUsers)

        const { password: _, ...user } = createdUsers.pop();
        return user

      } catch (error) {
        if (error.code === PostgresErrorCode.UniqueViolation) throw new UserAlreadyExistsException(user.username);
        throw error;
      }
    });
  }

  async getUserById(id: number) {
    const user = await this.drizzleService.db.query.users
      .findFirst({ where: eq(databaseSchema.users.id, id) });

    if (!user) throw new NotFoundException();
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.drizzleService.db.query.users
      .findFirst({ where: eq(databaseSchema.users.username, username) });

    if (!user) throw new NotFoundException()
    return user;
  }

  async updateUserById(id: number, user: UpdateUserDto) {

    const { users } = databaseSchema

    const updatedUsers = await this.drizzleService.db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();

    if (updatedUsers.length === 0) throw new NotFoundException()
    return updatedUsers.pop();
  }





  // async getByEmail(email: string) {
  //   const allResults = await this.drizzleService.db
  //     .select()
  //     .from(databaseSchema.users)
  //     .where(eq(databaseSchema.users.email, email))
  //     .leftJoin(
  //       databaseSchema.addresses,
  //       eq(databaseSchema.users.addressId, databaseSchema.addresses.id),
  //     );

  //   const result = allResults.pop();

  //   if (!result) {
  //     throw new NotFoundException();
  //   }

  //   return {
  //     ...result.users,
  //     address: result.addresses,
  //   };
  // }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
