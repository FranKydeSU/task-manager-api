const supertest = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
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

test('Signup a new user', async () => {
    const response = await supertest(app)
        .post('/users')
        .send({
            name: 'Franky',
            email: 'franky@example.com',
            password: '1q2w3e4r'
        })
        .expect(201)

    // Check if new user added correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Check response 
    expect(response.body).toMatchObject({
        user: {
            name: 'Franky',
            email: 'franky@example.com'
        },
        token: user.tokens[0].token
    })

    // Check password isn't plain text
    expect(user.password).not.toBe('1q2w3e4r')
})

test('Login existing user', async () => {
    const response = await supertest(app)
        .post('/users/login')
        .send({
            email: userTest.email,
            password: userTest.password
        })
        .expect(200)

    // Check if there was user in database
    const user = await User.findById(userTestId)
    expect(user).not.toBeNull()

    // Check user second token are matches with response second token
    expect(user.tokens[1].token).toBe(response.body.token)
})

test("Can't Login existing user", async () => {
    await supertest(app)
        .post('/users/login')
        .send({
            email: userTest.email,
            password: "thisIsNotUserOnePassword",
        })
        .expect(400)
})

test('Get profile for user', async () => {
    await supertest(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Can't Get profile for user", async () => {
    await supertest(app)
        .get('/users/me')
        .set('Authorization', 'thisIsNotUserTestToken')
        .send()
        .expect(401)
})

test('Delete account for user', async () => {
    await supertest(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send()
        .expect(200)

    // Check if account actually not in database
    const user = await User.findById(userTestId)
    expect(user).toBeNull()
})

test("Can't delete account for user", async () => {
    await supertest(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Upload avatar image', async () => {
    await supertest(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/Me.jpg')
        .expect(200)

    const user = await User.findById(userTestId)
    expect(user.avatar).toEqual(expect.any(Buffer)) // {} === {} => false
})

test('Update valid user fields', async () => {
    await supertest(app)
        .patch('/users/me')
        .send({
            name: 'test2User'
        })
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .expect(200)

    const user = await User.findById(userTestId)
    expect(user.name).toEqual('test2User')
})

test("Can't Update valid user fields", async () => {
    await supertest(app)
        .patch('/users/me')
        .send({
            location: 'Bangkok'
        })
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .expect(400)
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated
