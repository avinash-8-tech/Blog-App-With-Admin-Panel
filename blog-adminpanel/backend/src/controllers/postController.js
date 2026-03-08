import db from '../config/db.js';

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const postResult = await db.query(
      'SELECT id, title FROM posts WHERE id = $1',
      [id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = postResult.rows[0];

    await db.query('DELETE FROM posts WHERE id = $1', [id]);

    res.json({
      success: true,
      message: `Post "${post.title}" deleted successfully`
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const postsResult = await db.query(`
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.slug, 
        p.created_at,
        u.name as author_name,
        u.id as author_id
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      count: postsResult.rows.length,
      posts: postsResult.rows
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const postResult = await db.query(`
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.content,
        p.slug, 
        p.created_at,
        u.name as author_name,
        u.email as author_email
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `, [id]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      post: postResult.rows[0]
    });
  } catch (error) {
    console.error('Get post by id error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};