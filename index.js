const typeDefs = `
    type Query {
        totalPhoto: Int!
    }
`
const resolvers = {
    Query: {
        totalPhoto: () => 42
    }
}