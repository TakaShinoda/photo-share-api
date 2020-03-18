// apollo-serverモジュールの読み込み
const {ApolloServer} = require('apollo-server')

// 文字列としてスキーマを定義
const typeDefs = `
    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
    }

    # enum型の定義
    enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }

    # photo型の定義
    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
    }

    #入力型の定義
    input PostPhotoInput {
        name: String!
        #categoryフィールドを指定しない場合デフォルトでPORTRAITが適用
        category: PhotoCategory=PORTRAIT
        description: String
    }

    # allphotosはPhotoを返す
    type Query {
        totalPhoto: Int!
        allPhotos: [Photo!]!
    }

    # Mutationによって新たに投稿されたPhotoを返す
    type Mutation {
        postPhoto(input: PostPhotoInput!): Photo!
    }
`

// リゾルバはスキーマの定義を満たす
// スキーマで定義されたフィールド名と同じ名前を持ち，スキーマで定義されたデータ型の結果を返す
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
        "githubUser": "hoge1"
    },
    {
        "id": "2",
        "name": "bbb",
        "description": "the aacccaa",
        "githubUser": "hoge2"

    },
    {
        "id": "3",
        "name": "ccc",
        "description": "the baaa",
        "category": "LANDSCAPE",
        "githubUser": "hoge3"

    }
]

const resolvers = {
    Query: {
        totalPhoto: () => photos.length,
        allPhotos: () => photos
    },
    Mutation: {
        // args変数は{name.description}2つのフィールドを含むオブジェクト
        postPhoto(parent, args) {
            let newPhoto = {
                id: _id++,
                ...args.input
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
        }
    },

    User: {
        postedPhotos: parent => {
            return photos.filter(p => p.githubUser == parent.githubLogin)
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