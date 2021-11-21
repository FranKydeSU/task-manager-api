const app = require('./app')

const port = process.env.PORT

app.use((req, res, next) => {
    const maintenance = false
    if (maintenance) {
        res.status(503).send('Site is currently down. Check back soon!')
    } else {
        next()
    }
})

app.listen(port, () => {
    console.log('Server is up on port ', port)
})