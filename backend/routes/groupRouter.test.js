const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const groupRouter = require('../routes/groupRouter'); // Adjust the path as needed
const GroupService = require("../services/GroupService");

jest.mock('../services/groupService'); // Mock the service

const app = express();
app.use(express.json());
app.use('/groups', GroupService);

const JWT_SECRET = 'Vkm123vkm$$$';
const token = jwt.sign({ userId: '123' }, JWT_SECRET);

const mockGroup = {
  id: '1',
  name: 'Team Alpha',
  description: 'A group for project Alpha',
};

describe('Group Router', () => {
  test('GET /groups - Should fetch all groups', async () => {
    GroupService.getGroups.mockResolvedValueOnce([mockGroup]);

    const response = await request(app)
      .get('/groups')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockGroup]);
  });

  test('DELETE /groups/:id - Should delete a group', async () => {
    GroupService.mockImplementation(() => ({
      deleteGroup: jest.fn().mockResolvedValueOnce(true),
    }));

    const response = await request(app)
      .delete('/groups/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Group deleted' });
  });

  test('Unauthorized requests should return 401', async () => {
    const response = await request(app).get('/groups');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token required');
  });
  console.log(require.resolve('../services/groupService'));

});