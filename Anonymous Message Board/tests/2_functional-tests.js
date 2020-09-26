/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let id_1, id_2, post_id_1, post_id_2;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Posting new thread with no query at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .post('/api/threads/test')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Posting new thread with incomplete query at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .post('/api/threads/test')
        .send({delete_password: 'incorrect password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Posting new thread at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .post('/api/threads/test')
        .send({text: 'Test thread 1', delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          let regexStr = new RegExp(`^http://${res.request.host}/b\/test`)
          assert.match(res.redirects[0], regexStr, 'Redirects correctly')
          id_1 = res.redirects[0].replace(/.+(_id=)/i ,'')
          done()
        })
      })
      
      test('Posting second new thread at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .post('/api/threads/test')
        .send({text: 'Test thread 2', delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          let regexStr = new RegExp(`^http://${res.request.host}/b\/test`)
          assert.match(res.redirects[0], regexStr, 'Redirects correctly')
          id_2 = res.redirects[0].replace(/.+(_id=)/i ,'')
          done()
        })
      })
    });
    
    suite('GET', function() {
      test('Getting full list of threads at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .get('/api/threads/test')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.isArray(res.body, 'Result is an array')
          assert.property(res.body[0], '_id', 'Has property _id')
          assert.property(res.body[0], 'text', 'Has property text')
          assert.property(res.body[0], 'created_on', 'Has property created_on')
          assert.property(res.body[0], 'bumped_on', 'Has property bumped_on')
          assert.property(res.body[0], 'replycount', 'Has properrty replycount')
          assert.property(res.body[0], 'replies', 'Has property replies')
          assert.notProperty(res.body[0], 'reported', 'Has not property reported')
          assert.notProperty(res.body[0], 'delete_password', 'Has not property delete_password')
          assert.isArray(res.body[0].replies, 'Replies property is an array')
          assert.equal(res.body[0].replycount, 0, 'No replies by default')
          assert.equal(res.body[0].text, 'Test thread 2', 'Text is as was entered')
          assert.equal(res.body[0]._id, id_2, 'ID is as was created')
          done()
        })
      })
      
      test('Getting list from empty collection at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .get('/api/threads/testEmpty')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body, 'Result is an array')
          assert.equal(res.body.length, 0, 'Array is empty')
          done()
        })
      })
    });
    
    suite('DELETE', function() {
      test('Delete a thread with incomplete query at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .delete('/api/threads/test')
        .send({delete_password: 'incorrect password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Delete a thread with no query at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .delete('/api/threads/test')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Delete a thread with incorrect password at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id: id_1, delete_password: 'incorrect password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect password', 'Incorrect password was entered')
          done()
        })
      })
      
      test('Delete a thread with incorrect id at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id: 'invalid id', delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect board or id', 'Incorrect is or board was entered')
          done()
        })
      })
      
      test('Delete a thread at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id: id_1, delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'success', 'Succesfully deleted thread')
          done()
        })
      })
    });
    
    suite('PUT', function() {
      test('Reporting thread with no query at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .put('/api/threads/test')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Reporting thread with incorrect board at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .put('/api/threads/testEmpty')
        .send({thread_id: id_1})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect board or id', 'Succesfully reported thread')
          done()
        })
      })
      
      test('Reporting thread with incorrect id at /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .put('/api/threads/test')
        .send({thread_id: id_1})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect board or id', 'Succesfully reported thread')
          done()
        })
      })
      
      test('Reporting thread /API/THREADS/{BOARD}', done => {
        chai.request(server)
        .put('/api/threads/test')
        .send({thread_id: id_2})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'reported', 'Succesfully reported thread')
          done()
        })
      })
    });
    

  });
  
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Posting new reply with no query at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .post('/api/replies/test')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Posting new reply with incomplete query at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .post('/api/replies/test')
        .send({thread_id: id_2})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Posting new reply at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .post('/api/replies/test')
        .send({thread_id: id_2, text: 'Post #1 test text', delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          let regexStr = new RegExp(`^http://${res.request.host}/b\/test`)
          assert.match(res.redirects[0], regexStr, 'Redirects correctly')
          post_id_1 = res.redirects[0].replace(/.+(_id=)/i ,'')
          done()
        })
      })
      
      test('Posting 2nd new reply at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .post('/api/replies/test')
        .send({thread_id: id_2, text: 'Post #2 test text', delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          let regexStr = new RegExp(`^http://${res.request.host}/b\/test`)
          assert.match(res.redirects[0], regexStr, 'Redirects correctly')
          post_id_2 = res.redirects[0].replace(/.+(_id=)/i ,'')
          assert.notEqual(post_id_1, post_id_2, 'Post id is unique')
          done()
        })
      })
    });
    
    suite('GET', function() {
      test('Getting thread with no query at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .get('/api/replies/test')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Getting thread with at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .get('/api/replies/test')
        .query({thread_id: id_2})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.isObject(res.body, 'Result is an array')
          assert.property(res.body, '_id', 'Has property _id')
          assert.property(res.body, 'created_on', 'Has property created_on')
          assert.property(res.body, 'bumped_on', 'Has property bumped_on')
          assert.isArray(res.body.replies, 'Replies property is an array')
          assert.notProperty(res.body, 'reported', 'Has not property reported')
          assert.notProperty(res.body, 'delete_password', 'Has not property delete_password')
          assert.equal(res.body.replycount, 2, 'Two replies were posted')
          assert.equal(res.body.text, 'Test thread 2', 'Text is as was entered')
          assert.equal(res.body._id, id_2, 'ID is as was created')
          assert.isObject(res.body.replies[0], 'Replies element is an object')
          assert.property(res.body.replies[0], 'created_on', 'Has property created_on')
          assert.equal(res.body.replies[0].text, 'Post #2 test text', 'Has entered text')
          assert.notProperty(res.body.replies[0], 'reported', 'Has not property reported')
          assert.notProperty(res.body.replies[0], 'delete_password', 'Has not property delete_password')
          assert.equal(new Date(res.body.bumped_on).getTime(), new Date(res.body.replies[0].created_on).getTime(), 'Bumped_on updated after adding new post')
          done()
        })
      })
    });
    
    suite('PUT', function() {
      test('Putting post with no query at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .put('/api/replies/test')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Putting post with incomplete query at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .put('/api/replies/test')
        .send({thread_id: id_2})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Reporting post with invalid thread id at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .put('/api/replies/test')
        .send({thread_id: id_1, reply_id: post_id_1})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect board or id', 'Incorrect query was used')
          done()
        })
      })
      
      test('Reporting post with invalid post id at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .put('/api/replies/test')
        .send({thread_id: id_2, reply_id: 'incorrect post id'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect board or id', 'Incorrect query was used')
          done()
        })
      })
      
      test('Reporting post with at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .put('/api/replies/test')
        .send({thread_id: id_2, reply_id: post_id_1})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'reported', 'Succesfully reported')
          done()
        })
      })
    });
    
    suite('DELETE', function() {
      test('Deleting post with no query at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .delete('/api/replies/test')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Deleting post with incomplete query at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: id_2, delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect query', 'Incorrect query was used')
          done()
        })
      })
      
      test('Deleting post with invalid thread_id at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: id_1, reply_id: post_id_1, delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect board or thread id', 'Incorrect thread id was used')
          done()
        })
      })
      
      test('Deleting post with invalid reply_id at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: id_2, reply_id: 'incorrect post id', delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect post id', 'Incorrect post id was used')
          done()
        })
      })
      
      test('Deleting post with invalid password at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: id_2, reply_id: post_id_1, delete_password: 'incorrect password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'incorrect password', 'Incorrect password was used')
          done()
        })
      })
      
      test('Deleting post at /API/REPLIES/{BOARD}', done => {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: id_2, reply_id: post_id_1, delete_password: 'correct password'})
        .end((err, res) => {
          assert.equal(res.status, 200, 'Status OK')
          assert.equal(res.text, 'success', 'Succesfully deleted post')
          done()
        })
      })
    });
    
  });

});
