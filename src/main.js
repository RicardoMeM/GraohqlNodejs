import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'

    //create schema
const yoga = createYoga({
    schema: createSchema({
        typeDefs : `
            type Query{
                hello: String!,

            }
        `,

        resolvers : {
            Query: {
                hello: () => {
                    return "Hello word";
                }
            }, 
        }
    })
})

const server = createServer(yoga)
server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql')
  })