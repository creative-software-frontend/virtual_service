const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getPosts,
    createPost,
    deletePost,
    toggleLike,
    getComments,
    addComment,
    sharePost,
} = require("../controllers/newsfeedController");

// ─── Posts ────────────────────────────────────────────────────────
// GET  /api/newsfeed          → list all posts (paginated) with like/comment/share counts
// POST /api/newsfeed          → create a new post
// DELETE /api/newsfeed/:id   → delete own post (cascades likes/comments/shares)

router.get("/",          authMiddleware, getPosts);
router.post("/",         authMiddleware, createPost);
router.delete("/:id",    authMiddleware, deletePost);

// ─── Likes ───────────────────────────────────────────────────────
// POST /api/newsfeed/:id/like  → toggle like (like if not liked, unlike if liked)

router.post("/:id/like", authMiddleware, toggleLike);

// ─── Comments ────────────────────────────────────────────────────
// GET  /api/newsfeed/:id/comments  → list comments for a post (paginated)
// POST /api/newsfeed/:id/comments  → add a comment to a post

router.get("/:id/comments",  authMiddleware, getComments);
router.post("/:id/comments", authMiddleware, addComment);

// ─── Shares ──────────────────────────────────────────────────────
// POST /api/newsfeed/:id/share  → record a share for a post

router.post("/:id/share", authMiddleware, sharePost);

module.exports = router;
