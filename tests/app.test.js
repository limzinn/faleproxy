const request = require('supertest');
const axios = require('axios');

jest.mock('axios');

const { createApp, startServer } = require('../app');

describe('App module', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createApp();
  });

  test('POST /fetch returns 400 when url is missing', async () => {
    const response = await request(app)
      .post('/fetch')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('URL is required');
  });

  test('POST /fetch uses upstream status code when available', async () => {
    const error = new Error('Not found');
    error.response = { status: 404, data: 'Not found' };
    axios.get.mockRejectedValueOnce(error);

    const response = await request(app)
      .post('/fetch')
      .send({ url: 'https://example.com/missing' });

    expect(axios.get).toHaveBeenCalledWith('https://example.com/missing');
    expect(response.status).toBe(404);
    expect(response.body.error).toContain('Failed to fetch content');
  });

  test('startServer returns a closable server instance', () => {
    const server = startServer(0);
    const address = server.address();

    expect(address.port).toBeGreaterThan(0);

    server.close();
  });
});
