import express from 'express'
import http from 'http'
import ngrok from 'ngrok'
import mongoose from 'mongoose'
import { Server } from "socket.io"
import bodyParser from "body-parser"
import jwt from "jsonwebtoken"

import User from './user.js'
// import {signToken} from "./token.js"

const app = express();
const server = http.createServer(app);
const io = new Server(server);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose.connect("mongodb://localhost:27017/test", () => {
  console.log("DB connected")
})

const verifyToken = (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.headers.token, '12345')
    if (decodedToken) {
      req.body["role"] = decodedToken.role
      console.log({decodedToken});
      return next()
    }
    res.status(400).send({error: "Inavlid token"})
  } catch (error) {
    res.status(400).send({error: "Inavlid token"})

  }
}

//getting userData
app.get('/getData', verifyToken , async (req, res) => {
  try {
    let allUsers = await User.find({role : {$lt: req.body.role}})
    res.send(allUsers);
  } catch (error) {
    console.log({error});
  }
});

//Creating User
app.post('/createUser',async (req, res) => {
  try {
    console.log("body",req.body);
    req.body["token"] = await signToken(req.body.email, req.body.role )
    let saveUser = new User(req.body)
    let carsSaved = await saveUser.save()
    res.send({'saved user': carsSaved});
  } catch (error) {
    console.log({error});
  }
});

const signToken = (email, role) => {
  return new Promise((resolve, reject) => {
    let token = jwt.sign({ email, role }, '12345');
    if (token) {
      return resolve(token)
    }
    reject("Error in creating token")
  })
}



server.listen(4000, () => {
  console.log('listening on *:4000');
});