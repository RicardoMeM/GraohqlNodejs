const {getUserId} =  require ('./src/utils')

const Book ={
    writted_by: (parent, args, {request,prisma}, info ) =>{

        const userId = getUserId(request)
        
        return prisma.books.findUnique({
            where: {
                id: parent.id
            }
        })
        .authors()
    }, 
    register_by: (parent, args, {request,prisma}, info) => {

        const userId = getUserId(request)

        return prisma.books.findUnique({
            where: {
                id : parent.id
            }
        }).users()
    }
}

module.exports = {Book}