import React, {useState} from 'react'

const BlogForm = ({handleBlogCreate}) => {
  const [title, setNewTitle] = useState('')
  const [author, setNewAuthor] = useState('')
  const [url, setNewUrl] = useState('')

  const addNewTitle = (event) => {
    setNewTitle(event.target.value)
  }

  const addNewAuthor = (event) => {
    setNewAuthor(event.target.value)
  }

  const addNewUrl= (event) => {
    setNewUrl(event.target.value)
  }

  const createBlog = () => {
    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    handleBlogCreate(newBlog)
  }
  
  return(
    <div>
    <form onSubmit={createBlog}>
      title:
      <input id='titleInput'
        value={title}
        onChange={addNewTitle}
      />
      author:
      <input id='authorInput'
        value={author}
        onChange={addNewAuthor}
      />
      url:
      <input id='urlInput'
        value={url}
        onChange={addNewUrl}
      />
      <button id='submitButton' type="submit">create</button>
    </form>
    </div>
  )
}

export default BlogForm