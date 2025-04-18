const Comment = require('../models/commentModel');

exports.listComments = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId }).populate('userId', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments.' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const commentData = {
      taskId: req.params.taskId,
      userId: req.user.id,  // assuming req.user is set after authentication
      content: req.body.content
    };
    const newComment = await Comment.create(commentData);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment.' });
  }
};
