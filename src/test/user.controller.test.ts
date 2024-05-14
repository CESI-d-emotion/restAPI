import request from 'supertest'
import app from '../index'

describe('GET /users', () => {
  it('Should return an array of users', async () => {
    const response = await request(app.express).get('/api/users')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
  })

  it('Should give an error after trying to get User by id', async () => {
    const response = await request(app.express).get('/api/users/0')

    expect(response.status).toBe(400)
  })
})
