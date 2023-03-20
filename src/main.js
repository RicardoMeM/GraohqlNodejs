import { createSchema, createYoga, filter, PubSub, createPubSub } from 'graphql-yoga'
import { createServer, request } from 'node:http'
import {db} from '../db'
import {Author} from '../Author'
import {Book} from '../Book'
import {Mutation} from '../resolvers/Mutation'
import {Subscription} from '../resolvers/Subscription'
import { PrismaClient } from '@prisma/client'
import {getUserId} from './utils'


const prisma = new PrismaClient()

const pubsub = createPubSub();
    //create schema
const yoga = createYoga({
    schema: createSchema({
        typeDefs : `
            type Query{
                hello(name: String): String!,
                user(id: ID ):User!,
                users(take: Int, skip: Int, orderBy:UsersOrderByInput): [User!]!,
                author(id : ID): Author!, 
                authors(take: Int, skip: Int, orderBy:AuthorOrderByInput): [Author!]!, 
                book(id : ID): Book!,
                books(take: Int, skip: Int, orderBy:BooksOrderByInput): [Book!]!,
            }
            type User {
                id: ID!, 
                name: String!,
                lastname: String!,
                email: String!, 
            }
            type Author {
                id: ID!, 
                name: String!, 
                country: String!, 
                register_by: User!, 
                books: [Book!]!
            }
            type Book {
                id: ID!,
                title: String!,
                description: String!,
                quantity: Int!,
                price: Int!,
                writted_by: Author!,
                register_by: User! 
            }
            type Mutation{
                signUp(
                    data: signUpInput
                    ): AuthPayload!
                login(
                    data: loginInput
                    ): AuthPayload!
                updateUser(
                    id: ID,
                    data: updateUserInput
                    ): User!,
                createAuthor(
                    data: createAuthorInput
                    ): Author!,
                updateAuthor(
                    id: ID,
                    data: updateAuthorInput
                    ): Author!,
                createBook(
                    data: createBookInput
                    ): Book!,
                updateBook(
                    id: ID!,
                    data: updateBookInput
                    ): Book!,
                deleteBook(id: ID!): Book!,
            }

            type Subscription{
                count: Int!
            }

            input signUpInput{
                name: String!,
                lastname: String!, 
                email: String!, 
                password: String!,
            }
            input loginInput{
                email: String!
                password: String!
            }

            type AuthPayload{
                user: User!,
                token: String!
            }

            input updateUserInput{
                name: String,
                lastname: String, 
                email: String, 
                password: String, 
            }

            input createAuthorInput{
                name: String,
                country: String,
                register_by: ID! 
            }

            input updateAuthorInput{
                name: String,
                country: String,
                register_by: ID
            }

            input createBookInput{
                title: String,
                description: String,
                quantity: Int,
                price: Int,
                writted_by: ID,
                register_by: ID
            }

            input updateBookInput{
                title: String,
                description: String,
                quantity: Int,
                price: Int,
                writted_by: ID,
                register_by: ID
            }

            input AuthorOrderByInput{
                id: OrderByArg
                name: OrderByArg
                country: OrderByArg
            }

            input UsersOrderByInput{
                id: OrderByArg
                name: OrderByArg
                country: OrderByArg
            }

            input BooksOrderByInput{
                id: OrderByArg
                name: OrderByArg
                country: OrderByArg
            }

            enum OrderByArg{
                asc,
                desc
            }
        `,

        resolvers : {
            Query: {
                hello: (args) => {
                   return "Hola"
                },
                user: (parent, {id}, {request ,prisma}, info) => {

                    const userId = getUserId(request)

                        return prisma.users.findUnique({
                            where: { id: parseInt(id) },
                     })  
                },
                users: (parent, {take, skip, orderBy}, {request,prisma}, info) => {

                    const userId = getUserId(request)

                       return prisma.users.findMany({
                        take,
                        skip,
                        orderBy,
                       })
                },
                author (parent, {id}, {request,prisma}, info){
    
                    const userId = getUserId(request)

                    return prisma.authors.findUnique({
                        where: { id: parseInt(id) }, 
                    })
                },
                authors (parent, {take, skip, orderBy}, {request,prisma}, info){
                    
                    const userId = getUserId(request)
                    
                    return prisma.authors.findMany({
                        take,
                        skip,
                        orderBy,
                    })
                },
                book (parent, {id}, {request,prisma}, info){
                    
                    const userId = getUserId(request)

                    return prisma.books.findUnique({
                        where: { id: parseInt(id) },
                    })
                },
                books (parent, {take, skip, orderBy}, {request,prisma}, info){
                    
                    const userId = getUserId(request)

                    return prisma.books.findMany({
                        take,
                        skip,
                        orderBy, 
                    })
                },
            },
            Author,
            Book,
            Mutation, 
            Subscription, 
        }
    }),
    context: request => { 
        return{
            db, pubsub, prisma,
            ...request,  
        } 
    },
})

const server = createServer(yoga)
server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql')
  })