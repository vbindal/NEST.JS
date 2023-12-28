import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../decorator';
import { CreateBookmarkDto, EditBookMarkDto } from '../dto';


@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService){}
    @Get()
    getBookmark(@GetUser('id') userId: number){
        return this.bookmarkService.getBookmark(userId)
    }
  
    @Post()
    CreateBookMark(
        @GetUser('id') userId: number,
        @Body() dto: CreateBookmarkDto
    ){
        return this.bookmarkService.CreateBookMark(userId,dto)
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number,
    @Param('id',ParseIntPipe) bookmarkId: number){
        return this.bookmarkService.getBookmarkById(userId,bookmarkId)
    }

    @Patch()
    EditBookmarkById(@GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto : EditBookMarkDto){
        return this.bookmarkService.EditBookmarkById(userId,bookmarkId,dto)
    }

    @Delete(':id')
    DeleteBookMarkById(@GetUser('id') userId: number,
    @Param('id',ParseIntPipe) bookmarkId: number){
        return this.bookmarkService.DeleteBookMarkById(userId,bookmarkId)
    }
}
