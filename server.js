/*
  Run with  node --inspect server.js


*/


// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;


const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ error: 'No token provided.' });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    req.userID = decoded.id;
    next();
  });
}


app.get('/api/me', verifyToken, (req,res) => {
  knex('authors').where('id',req.userID).first().select('username','name','id').then(author => {
    res.status(200).json({author:author});
  }).catch(error => {
    res.status(500).json({ error });
  });
});


// Login
app.post('/api/login', (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.status(400).send();
  knex('authors').where('username',req.body.username).first().then(author => {
    if (author === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, author.hash),author];
  }).spread((result,author) => {
    if (result) {
      let token = jwt.sign({ id: author.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
        res.status(200).json({author:{username:author.username,name:author.name,id:author.id},token:token});
      } else {
         res.status(403).send("Invalid credentials");
      }

    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Create an author
app.post('/api/authors', (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.name || !req.body.gender || !req.body.location)
    return res.status(400).send();
  knex('authors').where('username',req.body.username).first().then(author => {
    if (author !== undefined) {
      res.status(403).send("Username already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('authors').insert({hash: hash, username:req.body.username,
				 name:req.body.name, gender:req.body.gender, location:req.body.location});
  }).then(ids => {
    return knex('authors').where('id',ids[0]).first().select('username','name','id');
  }).then(author => {
    let token = jwt.sign({ id: author.id }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({author:author,token:token});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Get all stories for an author
app.get('/api/authors/:id/stories', (req, res) => {
  let id = parseInt(req.params.id);
  if (id === NaN) {
    res.status(500).json({ error });
  }
  knex('authors').join('stories','authors.id','stories.user_id')
    .where('authors.id',id)
    .orderBy('stories.id', 'desc')
    .select('title','link','status','genre','username','name', 'stories.id').then(stories => {
      res.status(200).json({stories:stories});
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// Get all updates for an author
app.get('/api/authors/:id/updates', (req, res) => {
  let id = parseInt(req.params.id);
  knex('updates').join('authors','authors.id','updates.user_id')
    .join('stories', 'stories.id','updates.story_id')
    .where('authors.id',id)
    .orderBy('updates.updated', 'desc')
    .select('stories.title','updates.old','updates.new','updates.updated').then(updates => {
      res.status(200).json({updates:updates});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

// Add a story for an author
app.post('/api/authors/:id/stories', (req, res) => {
  let id = parseInt(req.params.id);
  knex('authors').where('id',id).first().then(author => {
    return knex('stories').insert({user_id: id, title:req.body.title, link:req.body.link, status:req.body.status,
                                    genre:req.body.genre});
  }).then(ids => {
    return knex('stories').where('id',ids[0]).first();
  }).then(story => {
    res.status(200).json({story:story});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});


// Delete a story
app.delete('/api/authors/:authorid/stories/:storyid', (req, res) => {
  let storyid = parseInt(req.params.storyid);
  let authorid = parseInt(req.params.authorid);
  knex('authors').where('id',authorid).first().then(author => {
    return knex('stories').where('id',storyid).first();
  }).then(story => {
    return knex('updates').where({'story_id':storyid}).del();
  }).then(story => {
    return knex('stories').where({'id':storyid,user_id:authorid}).first().del();
  }).then(ids => {
    res.sendStatus(200);
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
})

// Update a story and add an update entry
app.post('/api/authors/:authorid/stories/:storyid', (req, res) => {
  let storyid = parseInt(req.params.storyid);
  let authorid = parseInt(req.params.authorid);
  let oldval = '';
  knex('stories').where('id',storyid).first().then(story => {   // Check if story exists
    if (story === undefined) {
      res.status(403).send("Cannot update story; story does not exist");
      throw new Error('abort');
    }
    else if (story.user_id !== authorid) {   // Check if author owns it
      res.status(403).send("Cannot update story; you do not own it!");
      throw new Error('abort');
    }
    else {
      oldval = story.status;
      return story;
    }
  }).then(story => {
    return knex('stories').where('id', storyid).update({status:req.body.newStatus});
  }).then(story => {
    return knex('updates').insert({type: 'status', old: oldval, new: req.body.newStatus, updated: new Date(),
                            user_id: authorid, story_id: storyid});
  }).then (story => {
    res.status(200).json({story:story});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });

});



app.listen(3000, () => console.log('Server listening on port 3000!'));
