Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  }).then(() => {
    cy.visit('http://localhost:3000')
  })
})


Cypress.Commands.add('getAllBlogs', () => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'GET',
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  }).then(({ body }) => {
    return body
  })
})


describe('Blog app', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/testing/reset')
      const user = {
        name: 'Aditya Kolachana',
        username: 'adikol',
        password: 'secret'
      }
      cy.request('POST', 'http://localhost:3001/api/users/', user)
      cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
      cy.contains('Blogs')
    })

    it('login form can be opened', function() {
        cy.contains('login').click()
      })    
})


describe('Login',function() {
  it('fails with wrong credentials', function() {
    cy.contains('login').click()
    cy.get('#username').type('adikol')
    cy.get('#password').type('secre')
    cy.get('#login-button').click()
    cy.get('.error').contains('Wrong credentials')

    cy.get('html').should('not.contain', 'adikol logged in')
  })

  it('succeeds with correct credentials', function() {

    cy.get('#username').clear()
    cy.get('#password').clear()

    cy.contains('login').click()
    cy.get('#username').type('adikol')
    cy.get('#password').type('secret')
    cy.get('#login-button').click()
    cy.contains('adikol logged-in')
  })
})

describe('when logged in', function() {

    it('a new note can be created', function() {
        cy.contains('new blog').click()
        cy.get('#titleInput').type('a blog created by cypress')
        cy.get('#authorInput').type('cypress')
        cy.get('#urlInput').type('www.cypress.com')
        cy.get('#submitButton').click()

        cy.login({ username: 'adikol', password: 'secret' })

        cy.contains('a blog created by cypress')
      })

      it('like a blog', function() {
        cy.contains('view').click()
        cy.contains('likes: 0')
        cy.contains('like').click()
        cy.contains('likes: 1')
      })

      it('remove a blog', function() {
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'a blog created by cypress')
      })

      describe('and several blogs exist', function () {

        beforeEach(function() {
          cy.login({ username: 'adikol', password: 'secret' })
          cy.createBlog({ title: 'first blog', author: 'first author', url: 'first url', likes: '5' })
          cy.createBlog({ title: 'second blog', author: 'second author', url: 'second url', likes: '8' })
          cy.createBlog({ title: 'third blog', author: 'third author', url: 'third url', likes: '2' })
        })
    
        it('find all likes and check for order', function() {
          var uiArray = [] 
          cy.get('li').each(($el) => {
            if($el.text().includes('likes'))
            {
              uiArray.push(parseInt($el.text().replace(/[^0-9]/g,'')))
            }
          })
          cy.wrap(uiArray).should("equal", uiArray.sort((a,b)=>b-a));
        })
    })
})


  


