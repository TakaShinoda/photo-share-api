// apollo-server-expressとexpressの読み込み
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
// fs:Node.jsのモジュール readFileSync:同期処理
const { readFileSync } = require('fs')
const { MongoClient } = require('mongodb')

require('dotenv').config()

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const resolvers = require('./resolvers')

// 非同期関数
async function start() {
    const app = express()
    const MONGO_DB = process.env.DB_HOST
    const client = await MongoClient.connect(
    MONGO_DB,{ useNewUrlParser: true }
    )
    
    const db = client.db()
    const context = { db }

    // サーバーのインスタンス作成
    // その際，typeDefs(スキーマ)とリゾルバを引数に取る
    const server = new ApolloServer({ typeDefs, resolvers, context })
    server.applyMiddleware({ app })

    app.get('/', (rep, res) => res.end('Welcome to the PhotoShare API'))
    app.get('/playground', expressPlayground({ endpoint: '/graphql'}))

    app.listen({ port: 4000 }, () => 
        console.log('GraphQL Server running @http://localhost4000${server.graphqlPath}')
    )
}

start()
