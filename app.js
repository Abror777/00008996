const express = require('express')
const app = express()

const fs = require('fs')

app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'pug')

app.use('/static', express.static('public'))

// Localhost:8000
app.get('/', (req, res) => {
	res.render('index')
})

app.get('/create', (req, res) => {
	res.render('create')
})

app.post('/create', (req, res) => {
	const name = req.body.name
	const surname = req.body.surname
	const JobType =  req.body.JobType
	const description = req.body.description

	if (name.trim() === '' && surname.trim() === '' && description.trim() === '' ) {
		res.render('create', { error: true})
	} else {
		fs.readFile('./data/applications.json', (err, data) => {
			if (err) throw err

			const applications = JSON.parse(data)

			applications.push({
				id: id (),
				name: name,
				surname: surname,
				description: description, 
			})

			fs.writeFile('./data/applications.json', JSON.stringify(applications), err => {
				if (err) throw err

				res.render('create', { success: true })
			})
		})
	}

})

const applications = ['Application-1', 'Application-2']

app.get('/applications', (req, res) => {
	res.render('applications', { applications: applications })
})

app.get('/applications/detail', (req, res) => {
	res.render('detail')
})

app.listen(8000, err => {
	if (err) console.log(err)

	console.log('Server is running: Port-8000')
})

function id () {
	return '_' + Math.random().toString(36).substr(2, 9);
  }; 