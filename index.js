// apollo-serverモジュールの読み込み
const {ApolloServer} = require('apollo-server')

const typeDefs = `
    type Query {
        totalPhoto: Int!
    }
`

// リゾルバはスキーマの定義を満たす
// スキーマで定義されたフィールド名と同じ名前を持ち，スキーマで定義されたデータ型の結果を返す
const resolvers = {
    Query: {
        totalPhoto: () => 42
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