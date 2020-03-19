
// apollo-server-expressとexpressの読み込み
const { ApolloServer } = require('apollo-server-express')

const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default

// graphqlモジュールの読み込み
const { GraphQLScalarType } = require('graphql')



let _id = 0
let users = [
    { "githubLogin": "mHattrup", "name": "Mike Hattrup" },
    { "githubLogin": "test1", "name": "user1" },
    { "githubLogin": "test2", "name": "user2" },
]
let photos = [
    {
        "id": "1",
        "name": "aaaaa",
        "description": "the aaaa",
        "category": "ACTION",
        "githubUser": "hoge1",
        "created": "3-28-1997"
    },
    {
        "id": "2",
        "name": "bbb",
        "description": "the aacccaa",
        "githubUser": "hoge2",
        "created": "1-2-2011"

    },
    {
        "id": "3",
        "name": "ccc",
        "description": "the baaa",
        "category": "LANDSCAPE",
        "githubUser": "hoge3",
        "created": "2018-06-21T19:08:33.308Z"

    }
]

let tags = [
    { "photoID": "1", "userID": "gPlake"},
    { "photoID": "2", "userID": "sSchmidt"},
    { "photoID": "2", "userID": "mHattrup"},
    { "photoID": "2", "userID": "gPlake"}
]

//let d = new Date('4/18/2018')
//const serialize = value => new Date(value).toISOString()
//const parseValue = value => new Date(value)
//const paeseLiteral = ast => ast.value


// リゾルバはスキーマの定義を満たす
// スキーマで定義されたフィールド名と同じ名前を持ち，スキーマで定義されたデータ型の結果を返す

const resolvers = {
    Query: {
        totalPhoto: () => photos.length,
        allPhotos: (parent, args) => {
            args.after
        }
    },

    Mutation: {
        // args変数は{name.description}2つのフィールドを含むオブジェクト
        postPhoto(parent, args) {
            let newPhoto = {
                id: _id++,
                ...args.input,
                created: new Date()
            }
            photos.push(newPhoto)
            return newPhoto
        }
    },
    // スキーマ内の各フィールドはリゾルバ内にマッピングできる
    Photo: {
        url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
        postedBy: parent => {
            return users.find(u => u.githubLogin == parent.githubUser)
        },
        taggedUsers: parent => tags
            // 対象写真が関係しているタグの配列を探す
            .filter(tag => tag.photoID == parent.id)
            // タグの配列をユーザIDの配列に変換
            .map(tag => tag.userID)
            // ユーザID配列をユーザオブジェクトの配列に変換
            .map(userID => users.find(u => u.githubLogin == userID))
    },

    User: {
        postedPhotos: parent => {
            return photos.filter(p => p.githubUser == parent.githubLogin)
        },
        inPhotos: parent => tags
            .filter(tag => tag.userID == parent.id)
            .map(tag => tag.photoID)
            .map(photoID => photos.find(p => p.id == photoID))
        
    },

    // GraphQLScalarTypeを用いてカスタムスカラー用のリゾルバを作成
    DateTime: new GraphQLScalarType ({
        name: `DateTime`,
        description: `A valid date time value.`,
        // 新しいスカラー型を作成する場合parseValue, serialize, parseLiteralを追加する必要がある(DateTypeスカラーを実装するフィールドまたは，引数を処理)
        parseValue: value => new Date(value),
        // ISO日時フォーマットの文字列を返す
        serialize: value => new Date(value).toISOString(),
        // クエリからASTでパースされた値の取得
        parseLiteral: ast => ast.value
    })
}

let app = express()

// サーバーのインスタンス作成
// その際，typeDefs(スキーマ)とリゾルバを引数に取る
const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app })
app.get('/', (rep, res) => res.end('Welcome to the PhotoShare API'))
app.get('/playground', expressPlayground({ endpoint: '/graphql'}))
app.listen({ port: 4000 }, () => 
    console.log('GraphQL Server running @http://localhost4000${server.graphqlPath}')
)

// webサーバの起動
// サーバーに対してlisten関数を実行することで、httpサーバーが待ち受けを開始
//server.listen().then(({url}) => console.log('GraphQL Server running on ${url}'))