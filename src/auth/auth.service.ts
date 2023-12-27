import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { AuthDto } from '../dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { config } from 'process';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  /*SignUp Service */

  async signup(dto: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      //save the new user to the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      //return the saved user
     // delete user.hash;
      console.log('successfully signed up');
      return this.signInToken(user.id,user.email);
    } catch (err) {
      if (
        err instanceof
        PrismaClientKnownRequestError
      ) {
        if (
          err.code ===
          'P2002' /*unique field is violated this code is for that*/
        ) {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw err;
    }
  }

  /*SingIn Service */

  async signin(dto: AuthDto) {
    try {
      // Find the user by email
      const user =
        await this.prisma.user.findUnique({
          where: {
            email: dto.email,
          },
        });

      // If user does not exist, throw exception
      if (!user) {
        throw new NotFoundException(
          'User not found',
        );
      }

      // Ensure user has a hash property before accessing it
      if (!user.hash) {
        throw new InternalServerErrorException(
          'User hash not found',
        );
      }

      // Compare password
      const pwMatches = await argon.verify(
        user.hash,
        dto.password,
      );

      // If password is incorrect, throw exception
      if (!pwMatches) {
        throw new UnauthorizedException(
          'Incorrect Password',
        );
      }

      // Remove password hash from user object before returning
      
      console.log('successfully signed in');

      return this.signInToken(user.id,user.email);
    } catch (error) {
      // Handle any unexpected errors
      throw new InternalServerErrorException(
        'Authentication failed',
      );
    }
  }



  /*SignIn token */

  async signInToken(UserId:number,email:string):Promise<{access_token:string}>{
    const data = {
        sub:UserId,
        email
    }
    const secret = this.config.get("JWT_SECRET")

    const token = await this.jwt.signAsync(data,{
        expiresIn:'15m',
        secret:secret
    })
    return {
        access_token : token
    }
  }
}
