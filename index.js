// implement your API here
const express = require('express')

const db = require('./data/db.js')

const server = express()

server.use(express.json())

//get Request

server.get('/api/users', (req, res) => {
    db.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(() => {
        res.status(500).json({
          errorMessage: 'The users information could not be retrieved.',
        });
      });
  });
  
  server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist.' });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ errorMessage: 'The user information could not be retrieved.' });
      });
  });
  
  //post Request
  
  server.post("/api/users", (request, response) => {
    const { name, bio } = request.body;
    if (!name || !bio) {
      return response
        .status(400)
        .json({ error: "Please provide name and bio for the user." });
    }
    db.insert({ name, bio })
      .then(res => {
        const { id } = res;
        db.findById(id).then(user => {
          response.status(201).json(user);
        });
      })
      .catch(err => {
        response
          .status(400)
          .json({ errorMessage: "Please provide the name and bio for the user" });
      });
  });
  
  // DELETE Request
  
  server.delete("/api/users/:id", (req, res) => {
    db.remove(req.params.id)
      .then(count => {
        if (count && count > 0) {
          res.status(200).json({
            message: "the user was deleted."
          });
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(() => {
        res.status(500).json({
          errorStatus: "The user could not be removed"
        });
      });
  });
  
  // Put Request

  server.put("/api/users/:id", (req, res) => {
    const { name, bio } = req.body;
    if (!name || !bio) {
      res.status(400).json({
        errorStatus: "Please provide name and bio for the user."
      });
    } else {
      db.update(req.params.id, req.body)
        .then(user => {
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(404).json({
              message: "The user with the specified ID does not exist."
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            errorStatus: "The user information could not be modified."
          });
        });
    }
  });
  


server.listen(4000, () => {
    console.log('Server is running on port 4000...');
});