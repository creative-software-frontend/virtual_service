const db = require("../config/db");

function serviceError(message, statusCode = 400) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

/**
 * Atomically toggle a like on a post.
 * Returns { liked: boolean, likeCount: number }
 */
async function toggleLike(userId, postId) {
    const pid = parseInt(postId, 10);
    if (!pid) throw serviceError("Invalid post id", 400);

    const [postRows] = await db.query("SELECT id FROM posts WHERE id = ?", [pid]);
    if (!postRows.length) throw serviceError("Post not found", 404);

    const [existing] = await db.query(
        "SELECT 1 FROM post_likes WHERE user_id = ? AND post_id = ?",
        [userId, pid]
    );

    let liked;
    if (existing.length) {
        await db.query("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?", [userId, pid]);
        liked = false;
    } else {
        await db.query("INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)", [userId, pid]);
        liked = true;
    }

    const [[{ likeCount }]] = await db.query(
        "SELECT COUNT(*) AS likeCount FROM post_likes WHERE post_id = ?",
        [pid]
    );

    return { liked, likeCount: Number(likeCount) };
}

/**
 * Add a comment to a post.
 * Returns the populated comment with author info.
 */
async function addComment(userId, postId, content) {
    const pid = parseInt(postId, 10);
    if (!pid) throw serviceError("Invalid post id", 400);
    if (!content || !content.trim()) throw serviceError("Comment content cannot be empty", 400);
    if (content.trim().length > 1000) throw serviceError("Comment cannot exceed 1000 characters", 400);

    const [postRows] = await db.query("SELECT id FROM posts WHERE id = ?", [pid]);
    if (!postRows.length) throw serviceError("Post not found", 404);

    const [result] = await db.query(
        "INSERT INTO post_comments (post_id, user_id, content) VALUES (?, ?, ?)",
        [pid, userId, content.trim()]
    );

    const [[comment]] = await db.query(
        `SELECT pc.id, pc.post_id, pc.user_id, pc.content, pc.created_at,
                u.name AS author_name, u.avatar_url
         FROM post_comments pc
         JOIN users u ON u.id = pc.user_id
         WHERE pc.id = ?`,
        [result.insertId]
    );

    return comment;
}

/**
 * Fetch paginated comments for a post.
 * Returns { comments, total, page, limit }
 */
async function getComments(postId, page = 1, limit = 10) {
    const pid = parseInt(postId, 10);
    const pg = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pg - 1) * lim;

    if (!pid) throw serviceError("Invalid post id", 400);

    const [postRows] = await db.query("SELECT id FROM posts WHERE id = ?", [pid]);
    if (!postRows.length) throw serviceError("Post not found", 404);

    const [[{ total }]] = await db.query(
        "SELECT COUNT(*) AS total FROM post_comments WHERE post_id = ?",
        [pid]
    );

    const [comments] = await db.query(
        `SELECT pc.id, pc.post_id, pc.user_id, pc.content, pc.created_at,
                u.name AS author_name, u.avatar_url
         FROM post_comments pc
         JOIN users u ON u.id = pc.user_id
         WHERE pc.post_id = ?
         ORDER BY pc.created_at ASC
         LIMIT ? OFFSET ?`,
        [pid, lim, offset]
    );

    return { comments, total: Number(total), page: pg, limit: lim };
}

/**
 * Record a share event for a post.
 * Returns { shareCount: number }
 */
async function sharePost(userId, postId) {
    const pid = parseInt(postId, 10);
    if (!pid) throw serviceError("Invalid post id", 400);

    const [postRows] = await db.query("SELECT id FROM posts WHERE id = ?", [pid]);
    if (!postRows.length) throw serviceError("Post not found", 404);

    await db.query(
        "INSERT INTO post_shares (post_id, user_id) VALUES (?, ?)",
        [pid, userId]
    );

    const [[{ shareCount }]] = await db.query(
        "SELECT COUNT(*) AS shareCount FROM post_shares WHERE post_id = ?",
        [pid]
    );

    return { shareCount: Number(shareCount) };
}

module.exports = {
    toggleLike,
    addComment,
    getComments,
    sharePost,
};
