import {Test} from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, Param, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum'
import { AuthDto, CreateBookmarkDto, EditBookMarkDto, EditUserDto } from '../src/dto'
import { Edge } from '@nestjs/core/inspector/interfaces/edge.interface'

describe('App e2e',()=>{
  let app : INestApplication
    let prisma : PrismaService
  beforeAll(async()=>{
    
    const moduleRef = await Test.createTestingModule({
      imports : [AppModule]

    }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist:true
      })
    ),
    await app.init()
    prisma = app.get(PrismaService)

    await prisma.cleanDb()
    pactum.request.setBaseUrl('http://localhost:3000/')
    
  })

  afterAll(() => {
    app.close();
  });

  

  describe('Auth', () => {
    const dto :AuthDto={
      email:"vb@gmail.com",
      password:"123"
    }
    describe('Signup',()=>{
      it('SignUp Failed as email is Empty',()=>{
        return pactum.spec().post('auth/signup')
        .withBody({pasword:dto.password}).expectStatus(400)
      })

      it('SignUp Failed as Password is Empty',()=>{
        return pactum.spec().post('auth/signup')
        .withBody({email:dto.email}).expectStatus(400)
      })

      it('SignUp Failed as Body is Empty',()=>{
        return pactum.spec().post('auth/signup')
        .expectStatus(400)
      })

      it("Should SignUp",()=>{
        return pactum.spec().post('auth/signup')
        .withBody(dto).expectStatus(201)
      })
    })
    describe('SignIn',()=>{

      it('SignIn Failed as email is Empty',()=>{
        return pactum.spec().post('auth/signip')
        .withBody({pasword:dto.password}).expectStatus(404)
      })

      it('SignIn Failed as Password is Empty',()=>{
        return pactum.spec().post('auth/signip')
        .withBody({email:dto.email}).expectStatus(404)
      })

      it('SignIn Failed as Body is Empty',()=>{
        return pactum.spec().post('auth/signip')
        .expectStatus(404)
      })

      it("Should SignIn",()=>{
        return pactum.spec().post('auth/signin').withBody(dto).expectStatus(200)
        .stores('UserAt','access_token')
      })
    })
  })

  describe('User',()=>{
    describe('GetMe',()=>{
      it('It should get User Info',()=>{
        return pactum.spec().get('user/me').withBearerToken(`$S{UserAt}`).expectStatus(200).inspect()
      })
    })
    describe('EditUser',()=>{
      const dto : EditUserDto={
        firstName:"vishal",
        email:"vbindal@gmai.com"
      }
      it('It should Edit User Info',()=>{
        return pactum.spec().patch('user').withBearerToken(`$S{UserAt}`)
        .withBody(dto).expectStatus(200)
      })
    })
  })

  describe('Bookmarks',()=>{
    describe('Get Empty BookMark',()=>{
      it('it should get empty bookmark',()=>{
        
          return pactum.spec().get('bookmarks').withBearerToken(`$S{UserAt}`)
          .expectStatus(200).expectBody([])
        
      }
    )})
    describe('Create BookMark',()=>{
      const dto: CreateBookmarkDto={
        title:"first book title",
        link:"https://github.com/vbindal"
      }
      it('it should create bookmark',()=>{
        
        return pactum.spec().post('bookmarks').withBearerToken(`$S{UserAt}`)
        .withBody(dto)
        .expectStatus(201).stores('bookmarkId','id')
      
    }
  )
    })
    describe('Get BookMarks',()=>{
      it('it should get all bookmarks',()=>{
        
        return pactum.spec().get('bookmarks').withBearerToken(`$S{UserAt}`)
        .expectStatus(200)
      
    }
  )
    })
    describe('Get BookMark by id',()=>{
      it('it should get bookmark by id ',()=>{
        
        return pactum.spec().get('bookmarks/{id}')
        .withPathParams('id','$S{bookmarkId}')
        .withBearerToken(`$S{UserAt}`)
        .expectStatus(200).expectBodyContains('$S{bookmarkId}')
      
    }
  )
    })
    describe('Edit BookMark by id',()=>{

      const dto : EditBookMarkDto={
        title:"edited title",
        description:"changed the title"
      }
      it('it should edit bookmark by id ',()=>{
        
        return pactum.spec().get('bookmarks/{id}')
        .withPathParams('id','$S{bookmarkId}')
        .withBearerToken(`$S{UserAt}`).withBody(dto)
        .expectStatus(200).inspect()
      
    }
  )
    })

    describe('Delete BookMark',()=>{
      it('it should delete bookmark by id ',()=>{
        
        return pactum.spec().get('bookmarks/{id}')
        .withPathParams('id','$S{bookmarkId}')
        .withBearerToken(`$S{UserAt}`)
        .expectStatus(200).inspect()
      
    }
  )
    })


  })
  
})
