const newsfeedService = require("../services/newsfeedService");

async function toggleLike(req, res) {
    try {
        const result = await newsfeedService.toggleLike(req.user.id, req.params.id);
        res.json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

async function getComments(req, res) {
    try {
        const { page, limit } = req.query;
        const result = await newsfeedService.getComments(req.params.id, page, limit);
        res.json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

async function addComment(req, res) {
    try {
        const { content } = req.body;
        const comment = await newsfeedService.addComment(req.user.id, req.params.id, content);
        res.status(201).json(comment);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

async function sharePost(req, res) {
    try {
        const result = await newsfeedService.sharePost(req.user.id, req.params.id);
        res.json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

module.exports = { toggleLike, getComments, addComment, sharePost };
