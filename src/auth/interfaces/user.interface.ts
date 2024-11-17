import { Request } from 'express';
import { User } from 'src/users/types/user.type';

export interface UserRequest extends Request {
    user: User
}

// interface UserResponse extends Response {
//     id: number;
// }