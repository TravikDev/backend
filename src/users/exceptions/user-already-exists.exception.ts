
import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistsException extends BadRequestException {
  constructor(username: string) {
    super(`User with ${username} username already exists`);
  }
}