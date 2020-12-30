import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'
import Togglable from '../Togglable'
import BlogForm from '../BlogForm'

  describe('<Togglable />', () => {
    let component

    const blog = {
        user: 'adfaf',
        url: 'www.blogs.com',
        author: 'me',
        title: 'mytitle',
        likes: 5
      }
  
    const mockHandler = jest.fn()
  
    beforeEach(() => {
      component = render(
        <Togglable buttonLabel="view" heading={[blog.title, blog.author]}>
            <Blog blog={blog} handleLike={mockHandler} />
        </Togglable>
      )
    })

    test('at start the children are not displayed', () => {
        const div = component.container.querySelector('.headerContent')
        expect(div).toHaveTextContent(
            'me'
          )
          expect(div).toHaveTextContent(
            'mytitle'
          )
          expect(div).not.toHaveTextContent(
            'www.blogs.com'
          )
          expect(div).not.toHaveValue(5)
    })
  
    test('after clicking the button, children are displayed', () => {
      const button = component.getByText('view')
      fireEvent.click(button)
  
      const div = component.container.querySelector('.detailedContent')
      
      expect(div).toHaveTextContent(
        'me'
      )
      expect(div).toHaveTextContent(
        'mytitle'
      )
      expect(div).toHaveTextContent(
        'www.blogs.com'
      )
      expect(div).toHaveTextContent('5')
    })

    test('clicking the like button', () => {
        const button = component.getByText('like')
        fireEvent.click(button)
        fireEvent.click(button)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })

    test('<BlogForm /> updates parent state and calls onSubmit', () => {
        const handleBlogCreate = jest.fn()
      
        const component = render(
          <BlogForm handleBlogCreate={handleBlogCreate} />
        )

        const title = component.container.querySelector('#titleInput')
        const author = component.container.querySelector('#authorInput')
        const url = component.container.querySelector('#urlInput')

        const form = component.container.querySelector('form')
      
        fireEvent.change(title, { 
          target: { value: 'title could be better' }
        })
        fireEvent.change(author, { 
          target: { value: 'me ofcourse' }
        })
        fireEvent.change(url, { 
          target: { value: 'www.myblogs.com' }
        })
        fireEvent.submit(form)
     
        expect(handleBlogCreate.mock.calls).toHaveLength(1)
        expect(handleBlogCreate.mock.calls[0][0].title).toBe('title could be better' )
        expect(handleBlogCreate.mock.calls[0][0].author).toBe('me ofcourse' )
        expect(handleBlogCreate.mock.calls[0][0].url).toBe('www.myblogs.com' )
      })
  })