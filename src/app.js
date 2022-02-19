const express = require('express')
var cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/users', userRouter)
app.use('/tasks', taskRouter)

module.exports = app