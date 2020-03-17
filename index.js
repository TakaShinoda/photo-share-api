// apollo-serverモジュールの読み込み
const {ApolloServer} = require('apollo-server')

// 文字列としてスキーマを定義
const typeDefs = `
    type Query {
        totalPhoto: Int!
    }

    type Mutation {
        postPhoto(name: String! description: String): Boolean!
    }
`

// リゾルバはスキーマの定義を満たす
// スキーマで定義されたフィールド名と同じ名前を持ち，スキーマで定義されたデータ型の結果を返す

let photos = []

const resolvers = {
    Query: {
        totalPhoto: () => photos.length
    },
    Mutation: {
        postPhoto(parent, args) {
            photos.push(args)
            return true
        }
    }
}

// サーバーのインスタンス作成
// その際，typeDefs(スキーマ)とリゾルバを引数に取る
const server = new ApolloServer({
    typeDefs,
    resolvers
})

// webサーバの起動
// サーバーに対してlisten関数を実行することで、httpサーバーが待ち受けを開始
server
    .listen()
    .then(({url}) => console.log('GraphQL Server running on ${url}'))