const createThread = (document, res, boardName) => {
  document.save((err, data) => {
    if (err) throw err;
    res.redirect(`/b/${boardName}?_id=${data._id}`)
  })
}

const showAll = (board, res) => {
  board.find({}, {replies: {$slice: [0, 3]}})
    .sort({bumped_on: -1})
    .limit(10)
    .select('-delete_password -reported')
    .exec((err, data) => {
    if (err) return res.type('text').send(err.message)
    res.json(data)
  })
}

const reportThread = (board, _id, res) => {
  _id = _id.replace(/\s/g, '')
  board.findByIdAndUpdate(_id, {reported: true}, (err, data) => {
    if (err) return res.type('text').send('incorrect board or id')
    
    if (data !== null && data !== undefined) {res.type('text').send('reported')}
    else res.type('text').send('incorrect board or id')
  })
}

const deleteThread = (board, _id, password, res) => {
  _id = _id.replace(/\s/g, '')
  
  board.findById(_id, (err, data) => {
    if (err) return res.type('text').send('incorrect board or id');
    
    if (data.delete_password === password) {
      board.deleteOne({_id: _id}, (err, data) => {
        if (err) return res.type('text').send(err.message)
        res.type('text').send('success')
      })
    } else {
      res.type('text').send('incorrect password')
    }
  })
}

const createPost = (board, body, res, boardName) => {
  board.findByIdAndUpdate(body.thread_id, 
  {bumped_on: new Date(), 
   $inc: {replycount: 1}, 
   $push: {replies: {text: body.text, created_on: new Date(), delete_password: body.delete_password}}},
  {new: true})
  .select('-reported -delete_password -replies.delete_password -replies.reported')
  .exec(
  (err, data) => {
    if (err) return res.type('text').send(err.message)
    res.redirect('/b/' + boardName + '/' + body.thread_id + '?reply_id=' + data.replies[data.replies.length - 1]._id)
  })
}

const showThread = (board, _id, res) => {
  _id = _id.replace(/\s/g, '')
  
  board.updateMany(
    {}, 
    {"$push": {"replies": {"$each": [], "$sort": {"created_on": -1}}}}, 
    (err, data) => {
      if (err) throw err

      board.findById(_id).select('-delete_password -reported -replies.reported -replies.delete_password').exec((err, data) => {
        if (err) return res.type('text').send(err.message)
        res.json(data)
      })
  }) 
}

const reportPost = (board, thread_id, post_id, res) => {
  post_id = post_id.replace(/\s/g, '')
  thread_id = thread_id.replace(/\s/g, '')
  
  board.update({_id: thread_id, 'replies._id': post_id}, {'replies.$.reported': true}, (err, data) => {
    if (err) return res.type('text').send('incorrect board or id')
    
    if (data.n === 1) {res.type('text').send('reported')}
    else res.type('text').send('incorrect board or id')
  })
}

const deletePost = (board, thread_id, post_id, password, res) => {
  post_id = post_id.replace(/\s/g, '')
  thread_id = thread_id.replace(/\s/g, '')
  
  board.findById(thread_id, (err, data) => {
    if (err) throw err
    if (data === null || data === undefined) return res.type('text').send('incorrect board or thread id')
    
    if (data.replies.some(item => {return item._id.toString() === post_id})) {
      if (data.replies.id(post_id).delete_password === password) {
        data.replies.id(post_id).text = '[deleted]'
        data.replycount = --data.replycount;
        data.save()
      } else return res.type('text').send('incorrect password')
    } else return res.type('text').send('incorrect post id')
    
    res.type('text').send('success')
  })
}

exports.createThread = createThread;
exports.showAll = showAll;
exports.reportThread = reportThread;
exports.deleteThread = deleteThread;

exports.createPost = createPost;
exports.showThread = showThread;
exports.reportPost = reportPost;
exports.deletePost = deletePost;