/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
const database = require('./database.js');

/* Mongoose setup - start*/
mongoose.connect(process.env.DB2, { useNewUrlParser: true });

let Schema = mongoose.Schema

const repliesSchema = new Schema({
  text: String,
  created_on: {type: Date, default: new Date()},
  delete_password: String,
  reported: {type: Boolean, default: false}
})

const threadSchema = new Schema({
  text: String,
  created_on: {type: Date, default: new Date()},
  bumped_on: {type: Date, default: new Date()},
  reported: {type: Boolean, default: false},
  delete_password: String,
  replies: [repliesSchema],
  replycount: {type: Number, default: 0}
})

function thread(boardName) {return mongoose.model(boardName, threadSchema, boardName)}
/* Mongoose setup - end */

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get((req, res) => {
      database.showAll(thread(req.params.board.toLowerCase()), res)
    })
  
    .post((req, res) => {
      if (!req.body.hasOwnProperty('text') || !req.body.hasOwnProperty('delete_password')) {
        return res.type('text').send('incorrect query')
      }
    
      let document = new thread(req.params.board.toLowerCase())({
        text: req.body.text,
        reported: false,
        created_on: new Date(),
        bumped_on: new Date(),
        delete_password: req.body.delete_password
      })

      database.createThread(document, res, req.params.board.toLowerCase())
    })
  
    .put((req, res) => {
      if (!req.body.hasOwnProperty('thread_id')) return res.type('text').send('incorrect query')
    
      database.reportThread(thread(req.params.board.toLowerCase()), req.body.thread_id, res)
    })
  
    .delete((req, res) => {
      if (!req.body.hasOwnProperty('thread_id') || !req.body.hasOwnProperty('delete_password')) {
        return res.type('text').send('incorrect query')
      }
    
      database.deleteThread(thread(req.params.board.toLowerCase()), req.body.thread_id, req.body.delete_password, res)
    });
    
  app.route('/api/replies/:board')
    .get((req, res) => {
      if (!req.query.hasOwnProperty('thread_id')) return res.type('text').send('incorrect query') 
    
      database.showThread(thread(req.params.board.toLowerCase()), req.query.thread_id, res)
    })
  
    .post((req, res) => {
      if (!req.body.hasOwnProperty('thread_id') || (!req.body.hasOwnProperty('text') || !req.body.hasOwnProperty('delete_password') )) {
        return res.type('text').send('incorrect query')
      }
    
      database.createPost(thread(req.params.board.toLowerCase()), req.body, res, req.params.board.toLowerCase())
    })
  
    .put((req, res) => {
      if (!req.body.hasOwnProperty('thread_id') || !req.body.hasOwnProperty('reply_id')) {
        return res.type('text').send('incorrect query')
      }
    
      database.reportPost(thread(req.params.board.toLowerCase()), req.body.thread_id, req.body.reply_id, res)
    })
  
    .delete((req, res) => {
      if (!req.body.hasOwnProperty('thread_id') || (!req.body.hasOwnProperty('reply_id') || !req.body.hasOwnProperty('delete_password') )) {
        return res.type('text').send('incorrect query')
      }
    
      database.deletePost(thread(req.params.board.toLowerCase()), req.body.thread_id, req.body.reply_id, req.body.delete_password, res)
    });

};
