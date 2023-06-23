// 后端
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const { MongoClient } = require("mongodb")

const uri =
  "mongodb+srv://raliz716233:lU6723cK@ra-liz.xdqoour.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri)

// 操作数据库
// 查询菜谱
async function search(param) {
  try {
    const database = client.db("accounts") // 库名
    const coll = database.collection("account") // 表名

    const query = { name: param }
    const data = await coll.findOne(query) // 查询

    console.log(data)
    return data
  } finally {
    // await client.close()
  }
}
// 添加菜谱
async function add(param) {
  try {
    const database = client.db("accounts") // 库名
    const coll = database.collection("account") // 表名
    const result = await coll.insertOne(param) // 查询
    return result
  } finally {
    // aa
  }
}
// 删除
async function remove(param) {
  try {
    const database = client.db("accounts") // 库名
    const coll = database.collection("account") // 表名
    const result = await coll.deleteOne(param) // 查询
    return result.deletedCount
  } finally {
    // aa
  }
}
// 更改
async function update(filter, param) {
  try {
    const database = client.db("accounts") // 库名
    const coll = database.collection("account") // 表名
    const result = await coll.updateOne(filter, param) // 查询
    return result.matchedCount 
  } finally {
    // aa
  }
}


// 操作处理
const app = express()
const port = 4444

app.use(cors())
app.use(bodyParser.json())

let prevIndex = -1
app.all('/rand', async (req, res) => {
  try {
    const database = client.db('accounts')
    const coll = database.collection('account')

    // 随机索引
    const count = await coll.countDocuments()
    const randomIndex = Math.floor(Math.random() * count)
    while(randomIndex === prevIndex) {
      randomIndex = Math.floor(Math.random() * count)
    }
    prevIndex = randomIndex

    const data = await coll.findOne({}, { skip: randomIndex })

    if (data) {
      res.json(data)
    } else {
      res.json(null)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

app.all("/eat", async (req, res) => {
  try {
    const param = req.query.param // 获取前端发送的参数
    let data = await search(param) // 将参数传递给search函数进行查询
    res.json(data)
  } catch (err) {
    console.log(err)
    res.status(500).send("Internal Server Error")
  }
})

app.post("/add", async (req, res) => {
  try {
    const { name, msg } = req.body
    const param = { name, msg }
    let data = await add(param)
    res.json(data)
  } catch (err) {
    console.log(err)
    res.status(500).send("Internal Server Error")
  }
})

app.post("/delete", async (req, res) => {
  try {
    const { title } = req.body
    const param = { name: title }
    let data = await remove(param)
    if (data === 1) {
      res.send(true)
    } else {
      res.send(false)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Internal Server Error")
  }
})

app.post("/update", async (req, res) => {
  try {
    const { title, name, msg } = req.body
    const filter = { name: title }
    const param = { $set: { name, msg } }
    let data = await update(filter, param)
    if (data === 1) {
      res.send(true)
    } else {
      res.send(false)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Internal Server Error")
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
