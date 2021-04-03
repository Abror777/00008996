const express = require('express')
const app = express()

app.set('view engine', 'pug')

app.use('/static', express.static('public'))

// Localhost:8000
app.get('/', (req, res) => {
	res.render('index')
})

app.get('/create', (req, res) => {
	res.render('create')
})

app.listen(8000, err => {
	if (err) console.log(err)

	console.log('Server is running: Port-8000')
})
