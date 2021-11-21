const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userTestId = new mongoose.Types.ObjectId()
const userTest = {
    _id: userTestId,
    name: 'testUser',
    email: 'test@example.com',
    password: '123456789',
    tokens: [{
        token: jwt.sign({ _id: userTestId }, process.env.JWT_SECRET)
    }]
}

const userTestTwoId = new mongoose.Types.ObjectId()
const userTestTwo = {
    _id: userTestTwoId,
    name: 'testTwoUser',
    email: 'testTwo@example.com',
    password: '987654321',
    tokens: [{
        token: jwt.sign({ _id: userTestTwoId }, process.env.JWT_SECRET)
    }]
}

const taskTest = {
    _id: new mongoose.Types.ObjectId(),
    description: 'testing...',
    completed: false,
    owner: userTest._id
}

const taskTestTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'testing2...',
    completed: true,
    owner: userTest._id
}

const taskTestThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'testing3...',
    completed: false,
    owner: userTestTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany({})
    await Task.deleteMany({})
    await new User(userTest).save()
    await new User(userTestTwo).save()
    await new Task(taskTest).save()
    await new Task(taskTestTwo).save()
    await new Task(taskTestThree).save()
}

module.exports = {
    userTestId,
    userTest,
    userTestTwoId,
    userTestTwo,
    taskTest,
    taskTestTwo,
    taskTestThree,
    setupDatabase
}