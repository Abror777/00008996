const { application } = require('express')
const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

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
	const email= req.body.email
	const phone = req.body.phone
	const description = req.body.description

	if (name.trim() === '' && surname.trim() === '' && email.trim() === '' && phone.trim() === '' && description.trim() === '' ) {
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
				email: email,
				phone: phone,
			})

			fs.writeFile('./data/applications.json', JSON.stringify(applications), err => {
				if (err) throw err

				res.render('create', { success: true })
			})
		})
	}

})

app.get('/api/v1/applications', (req, res) => {
	fs.readFile('./data/applications.json', (err, data) => {
	  if (err) throw err
  
	  const applications = JSON.parse(data)
  
	  res.json(applications)
	})
  })

app.get('/applications', (req, res) => {
	fs.readFile('./data/applications.json', (err, data) => {
	  if (err) throw err

	  const applications = JSON.parse(data)

	  res.render('applications', { applications: applications })
    })
})

app.get('/applications/:id', (req, res) => { 
	const id = req.params.id

	fs.readFile('./data/applications.json', (err, data) => {
		if (err) throw err

		const applications = JSON.parse(data)

		const application = applications.filter(application => application.id == id)[0]

		res.render('detail', { application: application })
	})
})

app.get('/:id/delete', (req, res) => {
	const id = req.params.id

	fs.readFile('./data/applications.json', (err, data) => {
		if  (err) throw err

		const applications = JSON.parse(data)

		const filteredapplications = applications.filter(application => application.id != id)

		fs.writeFile('./data/applications.json', JSON.stringify(filteredapplications), (err) => {
			if (err) throw err

			res.render('applications', {applications, deleted: true})
		})
	})
})

app.get('/applications/:id/archive', (req, res) => {
	const id = req.params.id

	fs.readFile('./data/applications.json', (err, data) => {
	  if (err) throw err
	  
	  const applications = JSON.parse(data)
	  const applicationId  = applications.filter(application => application.id === id)
	  const splicedId = applications.splice(applicationId,1)[0]
	  applications.push(splicedId)

	  fs.writeFile('./data/application.json', JSON.stringify(applications), (err) => {
		if (err) throw err

		res.redirect('/applications')

	})
})
})


  app.get('/archive',(req,res)=>{
	fs.readFile('./data/applications.json', (err, data) => {
		if (err) throw err
		

		const applications = JSON.parse(data).filter(application => application.archive == true)
		res.render("applications", { applications: applications });

  })
})

  var multer  = require('multer')
  var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
		  cb(null, '/static/images/')
	  },
	  filename: function (req, file, cb) {
		  cb(null, file.originalname)
	}
  })
  
  var upload = multer({ storage: storage })
  

app.listen(8000, err => {
	if (err) console.log(err)

	console.log('Server is running: Port-8000')
})

function id() {
	return '_' + Math.random().toString(36).substr(2, 9);
  }