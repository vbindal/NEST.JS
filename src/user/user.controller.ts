import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard} from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../decorator';
import { JwtGuard } from '../guard';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
    @Get('me')
    getMe(@GetUser() user: User,
    @GetUser('email') email:string
    ){
        console.log({
            user
        })
        return user
    }

    @Patch()
    editUser(){
        
    }
}

