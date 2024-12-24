const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const expenseRouter = require('../routes/expenseRouter'); 
const ExpenseService = require('../services/ExpensesService'); 

jest.mock('../services/ExpensesService'); 

const JWT_SECRET = 'Vkm123vkm$$$';

// Mock Express App
const app = express();
app.use(express.json());
app.use('/expenses', expenseRouter);

// Mock Token
const token = jwt.sign({ userId: '123' }, JWT_SECRET);

// Mock Data
const mockExpense = {
  id: '1',
  user: '123',
  amount: 100,
  description: 'Lunch',
  date: '2024-01-01',
};

describe('Expense Router', () => {
  test('GET /expenses - Should fetch all expenses', async () => {
    ExpenseService.getExpenses.mockReturnValueOnce([mockExpense]);

    const response = await request(app)
      .get('/expenses')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockExpense]);
  });

  test('POST /expenses - Should create a new expense', async () => {
    const newExpense = { ...mockExpense, id: '2' };
    ExpenseService.createExpense.mockResolvedValueOnce(newExpense);

    const response = await request(app)
      .post('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user: '123',
        amount: 200,
        description: 'Dinner',
        date: '2024-01-02',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newExpense);
  });

  test('DELETE /expenses/:id - Should delete an expense', async () => {
    ExpenseService.mockImplementation(() => ({
      deleteExpense: jest.fn().mockResolvedValue(true),
    }));

    const response = await request(app)
      .delete('/expenses/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Expense deleted' });
  });

  test('Unauthorized requests should return 401', async () => {
    const response = await request(app).get('/expenses');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token required');
  });
});