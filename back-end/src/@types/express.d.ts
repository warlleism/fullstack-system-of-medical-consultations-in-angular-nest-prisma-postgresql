import { User } from 'src/modules/user/user.entity'; // Importe sua entidade User

declare global {
    namespace Express {
        interface Request {
            user?: Partial<User>;
        }
    }
}