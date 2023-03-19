const {getUserId} = require ('./src/utils')

const Author = {
    register_by: ( parent, args, {request,prisma}, info) => {

        const userId = getUserId(request)

        return prisma.authors.findUnique({
            where: {
                id: parent.id
            }
        })
        .users()
    },
    books: (parent, args, {request,prisma}, info) => {

        const userId = getUserId(request)

        return prisma.authors.findUnique({
            where: {
                id: parent.id,
            },
        })
        .books()
    }
}

module.exports = {Author}