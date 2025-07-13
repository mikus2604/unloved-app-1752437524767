Creating a full-stack web application for a blog involves several components: a React frontend, a Node.js backend, and a Supabase database schema. Below is a high-level guide to building such an application.

### Step 1: Set Up Supabase

1. **Create a Supabase Account**: Go to [Supabase](https://supabase.io/) and create an account.
2. **Create a New Project**: Set up a new project in the Supabase dashboard.
3. **Define the Database Schema**: Use Supabase’s SQL editor to create tables.

```sql
-- Create a 'posts' table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a 'comments' table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  author VARCHAR(100),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. **Configure API Keys**: Retrieve the project URL and API keys from the Supabase settings required for client and server interactions.

### Step 2: Build the Backend with Node.js

1. **Initialize Node.js Project**: Set up a new Node.js project using Express.js.

```bash
mkdir blog-backend
cd blog-backend
npm init -y
npm install express cors dotenv supabase-js
```

2. **Create Express Server**: Create a basic server in `server.js`.

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.get('/posts', async (req, res) => {
  const { data, error } = await supabase.from('posts').select();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.post('/posts', async (req, res) => {
  const { title, content, author } = req.body;
  const { data, error } = await supabase.from('posts').insert([{ title, content, author }]).single();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

3. **Environment Variables**: Create a `.env` file with your Supabase project details:

```plaintext
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-anon-key>
PORT=5000
```

### Step 3: Build the Frontend with React

1. **Initialize React App**: Use Create React App to set up your frontend.

```bash
npx create-react-app blog-frontend
cd blog-frontend
npm install @supabase/supabase-js
```

2. **Create a Supabase Client**: Set up the Supabase client in `src/supabaseClient.js`.

```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

3. **Build Blog Components**: Create components to display and add blog posts.

- **App.js**: Fetch and display posts, with a form to add a new post.

```javascript
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select();
    setPosts(data);
  };

  const addPost = async (e) => {
    e.preventDefault();
    await supabase.from('posts').insert([{ title, content, author }]);
    setTitle('');
    setContent('');
    setAuthor('');
    fetchPosts();
  };

  return (
    <div>
      <h1>Blog</h1>
      <form onSubmit={addPost}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <button type="submit">Add Post</button>
      </form>
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><em>By {post.author}</em></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
```

4. **Environment Variables**: In `blog-frontend`, create a `.env` file.

```plaintext
REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
```

### Step 4: Run the Application

- **Backend**: Navigate to `blog-backend` and run the server.

```bash
node server.js
```

- **Frontend**: Navigate to `blog-frontend` and start the React app.

```bash
npm start
```

### Step 5: Test Your Application

- Navigate to `http://localhost:3000` in your web browser to see your blog in action. You can create new posts and have them reflected instantly with a simple refresh.

This setup gives you a basic full-stack web application. You can continue to build on this by adding features such as user authentication, comments, or a more sophisticated design using a CSS framework or library.