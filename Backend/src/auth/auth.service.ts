import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const isMatch = await bcrypt.compare(pass.trim(), user.password.trim());

        if (!isMatch) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const payload = { sub: user.id, email: user.email, role: user.role?.name };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                firstName: user.firstName,
                role: user.role?.name
            }
        }
    }
}