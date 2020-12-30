import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './LoginForm'
import BlogForm from './BlogForm.js'
import Togglable from './Togglable.js'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ notificationMessage }) => {
  if (!notificationMessage || !notificationMessage.message || !notificationMessage.message.length) {
    return null
  }

  const notificationStyle = {
    color: notificationMessage.error ? 'red' : 'green',
    fontSize: 16,
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    maringBottom: 10
  }

  return (
    <div className="error" style={notificationStyle}>
      {notificationMessage.message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
 
  const [ notificationMessage, setNotificationMessage ] = useState({})

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const receivedBlogs = await blogService.getAll()
      setBlogs( receivedBlogs )
    }
    fetchData()
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleBlogCreate = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(newBlog)
  
    setNotificationMessage({message: `a new blog ${blogs[blogs.length - 1].title} by ${blogs[blogs.length - 1].author}`, error: false})
    setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
  
    setBlogs(blogs.concat(returnedBlog))
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage({message:'Wrong credentials', error: true})
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLike = async ({blog}) => {

      const newBlog = {
        user: blog.user,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1
      }

      const updatedBlog = await blogService.update(blog.id, newBlog)
      setBlogs(blogs.map(b => b.id !== updatedBlog.id ? b : updatedBlog))
  }

  const handleDelete = async ({blog}) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author} ?)`))
    {
      let id = blog.id
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
}

  const logout = () => {
    console.log("logging out")
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => {
    return (
      <div>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
      </div>
    )
  }

  const blogFormRef = useRef()

  const blogForm = () => (
  <Togglable buttonLabel="new blog" hideLabel="cancel" ref={blogFormRef} hiddenItems=''>
    <BlogForm handleBlogCreate={handleBlogCreate}/>
  </Togglable>
  )

  const blogContent = () =>  {
    blogs.sort((prevblog, blog) => (blog.likes > prevblog.likes) ? 1 : ((prevblog.likes > blog.likes) ? -1 : 0))
    return(
      <div>
        {blogs.map(blog =>
          {
            if(blog === null)
            return ''
            
            return(
            <Togglable key={blog.id} buttonLabel="view" hideLabel="hide" heading={[blog.title, blog.author]}>
              <Blog key={blog.id} blog={blog} handleLike={() => handleLike({blog})} handleDelete={() => handleDelete({blog})}  />
            </Togglable>
            )
        })
      }
      </div>
    )
  }

  if(user === null)
  {
    return (
      <div>
        <h2>Blogs</h2>
       <Notification notificationMessage={notificationMessage}/>
       <h2>login to the application </h2>
       {loginForm()}
      </div>
    )
  }

  return (
    <div>
     <Notification notificationMessage={notificationMessage}/>
        <div>
        <h2>Blogs</h2>
          <p>{user.username} logged-in  <button type="submit" onClick={logout}>logout</button></p>
          
          <h2>create new</h2>

          {blogForm()}
          
          {blogContent()}
        </div>
      </div>
  )
}

export default App