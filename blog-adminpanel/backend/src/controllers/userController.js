import db from '../config/db.js';

export const getUsers = async (req, res) => {
  try {
  
    const usersResult = await db.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.created_at,
        COUNT(p.id) as post_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.author_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      count: usersResult.rows.length,
      users: usersResult.rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const postsResult = await db.query(`
      SELECT 
        id, 
        title, 
        description, 
        slug, 
        created_at 
      FROM posts 
      WHERE author_id = $1 
      ORDER BY created_at DESC
    `, [id]);

    res.json({
      success: true,
      user: userResult.rows[0],
      posts: postsResult.rows,
      postCount: postsResult.rows.length
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📥 DELETE request for user:', id);

    const userResult = await db.query(
      'SELECT id, name FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.query('DELETE FROM posts WHERE author_id = $1', [id]);
    
    await db.query('DELETE FROM accounts WHERE user_id = $1', [id]);
    
    await db.query('DELETE FROM sessions WHERE user_id = $1', [id]);
    
    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: `User ${userResult.rows[0].name} deleted successfully`
    });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const postsResult = await db.query(`
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.slug, 
        p.created_at,
        u.name as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = $1
      ORDER BY p.created_at DESC
    `, [id]);

    res.json({
      success: true,
      count: postsResult.rows.length,
      posts: postsResult.rows
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};