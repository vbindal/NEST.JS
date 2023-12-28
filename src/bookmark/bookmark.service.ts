import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  CreateBookmarkDto,
  EditBookMarkDto,
} from '../dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmark(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        UserId: userId,
      },
    });
  }

  async CreateBookMark(
    userId: number,
    dto: CreateBookmarkDto,
  ) {
    const bookmark =
      await this.prisma.bookmark.create({
        data: {
          UserId: userId,
          ...dto,
        },
      });
    return bookmark;
  }

  getBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        UserId: userId,
      },
    });
  }

  async EditBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookMarkDto,
  ) {
    //first get the bookmark using bookmark id:

    const bookmark =
      this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    //check if the user id is associated to the given bookmark or not

    if (
      !bookmark ||
      (await bookmark).UserId !== userId
    ) {
      throw new ForbiddenException(
        'Access is denied for given request',
      );
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async DeleteBookMarkById(
    userId: number,
    bookmarkId: number,
  ) {
    //first get the bookmark using bookmark id:

    const bookmark =
      this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    //check if the user id is associated to the given bookmark or not

    if (
      !bookmark ||
      (await bookmark).UserId !== userId
    ) {
      throw new ForbiddenException(
        'Access is denied for given request',
      );
    }

    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
