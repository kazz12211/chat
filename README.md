# chat

## 概要

- Node.js (Express)からAngularフロントエンドアプリをサーブする例
- /server はNode.jsのサーバー、/client はAngularのアプリ
- Socket.IOを使用したチャット機能（チャットルームとチャットメッセージ）
- Json Web TokenとBcryptを使ったユーザ認証・アクセス制限機能

## 動作環境

- Angular 8.1.3
- Node.js 12.6.0
- SQLite3 4.1.0


## サンプルデータ

サンプルデータはSQLite3データベースのファイル（/server/db/chat）に格納されています。

### Room

|ID|名前|
|-|-|
|1|技術|
|2|歴史|
|3|政治|
|4|文化|
|5|芸能|

### User

|ログインID|パスワード|
|-|-|
|taro@example.com|1230|
|hanako@example.com|1230|
