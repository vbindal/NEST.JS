import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard} from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../decorator';
import { JwtGuard } from '../guard';
import {EditUserDto} from '../dto/edit-user.dto'
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {

    constructor(private userService: UserService){}
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
    editUser(@GetUser('id') userId: number, 
    @Body() dto: EditUserDto){
        return this.userService.editUser(userId,dto)
    }
}

