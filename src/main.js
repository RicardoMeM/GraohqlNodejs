import { createSchema, createYoga, filter } from 'graphql-yoga'
import { createServer } from 'node:http'
import {db} from '../db'
import {Author} from '../Author'
import {Book} from '../Book'


    //create schema
const yoga = createYoga({
    schema: createSchema({
        typeDefs : `
            type Query{
                hello(name: String): String!,
                user(id : ID ): [ User!]!,
                author (id : ID): [Author!]!, 
                book (id : ID): [Book!]!,
            }
            type User {
                id: ID!, 
                name: String!,
                lastName: String!,
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
        `,

        resolvers : {
            Query: {
                hello: (args) => {
                   return "Hola"
                },
                user(parent, {id}, context, info) {
                     const { db } = context

                     if(!id){
                        return db.users
                     }
                     return db.users.filter(user => user.id === id)
                },
                author (parent, {id}, {db}, info){
                    if(!id){
                        return db.authors
                    }
                    return db.authors.filter(author => author.id === id)
                },
                book (parent, {id}, {db}, info){
                    if(!id){
                        return db.books
                    }
                    return db.book.filter(book => book.id === id)
                },
            },
            Author,
            Book,
        }
    }),
    context: { db }
})

const server = createServer(yoga)
server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql')
  })