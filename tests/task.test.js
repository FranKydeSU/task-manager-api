const { notify } = require('superagent')
const supertest = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userTestId,
    userTest,
    userTestTwoId,
    userTestTwo,
    taskTest,
    taskTestTwo,
    taskTestThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Create a task', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .send({
            description: 'testing...'
        })
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .expect(201)
    //console.log(response.body)

    // Check if new task exists correctly
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()

    // Chech defalut completed value = false
    expect(task.completed).toEqual(false)
})

test('Fetching tasks from user', async () => {
    const response = await supertest(app)
        .get('/tasks')
        .send()
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toBe(2)
})

test("Deleting task security (Can't delete other user tasks)", async () => {
    await supertest(app)
        .delete(`/tasks/${taskTest._id}`)
        .send()
        .set('Authorization', `Bearer ${userTestTwo.tokens[0].token}`)
        .expect(404)

    const task = await Task.findById(taskTest._id)
    expect(task).not.toBeNull()
})

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks