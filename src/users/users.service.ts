import { Injectable, NotFoundException } from '@nestjs/common';
import { databaseSchema } from 'src/database/database-schema';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { DrizzleService } from 'src/database/drizzle.service';
import { eq } from 'drizzle-orm';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(private readonly drizzleService: DrizzleService) { }

  async createWithAddress(user: any) {
    // async createWithAddress(user: UserDto) {
    return this.drizzleService.db.transaction(async (transaction) => {
      const createdAddresses = await transaction
        .insert(databaseSchema.addresses)
        .values(user.address)
        .returning();

      const createdAddress = createdAddresses.pop();

      try {
        const createdUsers = await transaction
          .insert(databaseSchema.users)
          .values({
            name: user.name,
            email: user.email,
            password: user.password,
            addressId: createdAddress.id,
          })
          .returning();
        return createdUsers.pop();
      } catch (error) {
        if (
          // isRecord(error) &&
          error.code === PostgresErrorCode.UniqueViolation
        ) {
          throw new UserAlreadyExistsException(user.email);
        }
        throw error;
      }
    });
  }

  async getByEmail(email: string) {
    const user = await this.drizzleService.db.query.users.findFirst({
      with: {
        address: true,
      },
      where: eq(databaseSchema.users.email, email),
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
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
