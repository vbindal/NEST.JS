import { Injectable } from '@nestjs/common';
import { EditUserDto } from '../dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma:PrismaService){}
    async editUser(userId:number,dto:EditUserDto){
        const user = this.prisma.user.update({
            where:{
                id:userId,
            },
            data:{
                ...dto,
            }
        })
        delete (await user).hash
        return user 
    }
}
