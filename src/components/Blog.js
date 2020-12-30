import React from 'react'
const Blog = ({ blog, handleLike, handleDelete }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (

  <div style={blogStyle} className='blog'>
    <div>
    <ul>
    <li>title: {blog.title}</li> 
    <li>author: {blog.author}</li>
    <li>url: {blog.url}</li>
    <li>likes:  {blog.likes} <button type="submit" onClick={handleLike}>like</button> </li>
    <li>user: {blog.user ? blog.user.username : ''}</li>
    </ul>
    <p> {blog.user ? <button type="submit" onClick={handleDelete}>remove</button>  : ''} </p>
    </div>
  </div>
)}

export default Blog
