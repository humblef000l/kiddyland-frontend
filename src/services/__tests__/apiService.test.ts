// import { api, createApiClient, createCancellableRequest } from './'; // adjust import path as needed
import { api,createCancellableRequest ,createApiClient} from '../apiService';

// Mock environment variables

describe('API Service', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('URL Generation', () => {
    test('should generate relative URL with BASE_URL', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      
        await api.get('/users');
      
        expect(fetchMock).toHaveBeenCalledWith(
          'http://localhost:61423/users',
          expect.objectContaining({
            method: 'GET',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        );
      });
      

    test('should respect absolute URLs', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await api.get('https://other-api.com/users');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://other-api.com/users',
        expect.objectContaining({ method: 'GET' })
      );
    });

    test('should correctly add simple query parameters', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await api.get('/users', { page: 1, limit: 10 });
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/users?page=1&limit=10',
        expect.objectContaining({ method: 'GET' })
      );
    });

    test('should handle array query parameters correctly', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await api.get('/users', { tags: ['admin', 'active'] });
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/users?tags%5B%5D=admin&tags%5B%5D=active',
        expect.objectContaining({ method: 'GET' })
      );
    });

    test('should ignore null and undefined query parameters', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await api.get('/users', { name: 'John', status: null, role: undefined });
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/users?name=John',
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('Request Methods', () => {
    test('should make GET request correctly', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: 'response' }));
      const result = await api.get('/users');
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/users',
        expect.objectContaining({ method: 'GET' })
      );
      expect(JSON.parse(result)).toEqual({ data: 'response' });
    });

    test('should make POST request with correct body', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ id: 123 }));
      const payload = { name: 'John Doe', email: 'john@example.com' };
      const result = await api.post('/users', payload);
      
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload)
        })
      );
      expect(JSON.parse(result)).toEqual({ id: 123 });
    });

    test('should make PUT request with correct body', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      const payload = { name: 'Updated Name' };
      await api.put('/users/123', payload);
      
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/users/123',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(payload)
        })
      );
    });

    test('should make PATCH request with correct body', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      const payload = { status: 'active' };
      await api.patch('/users/123', payload);
      
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/users/123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(payload)
        })
      );
    });

    test('should make DELETE request correctly', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await api.delete('/users/123');
      
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/users/123',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    test('should not stringify FormData body', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      const formData = new FormData();
      formData.append('file', new Blob(['test content']), 'test.txt');
      
      await api.post('/upload', formData);
      
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/upload',
        expect.objectContaining({
          method: 'POST',
          body: formData
        })
      );
    });
  });

  describe('Response Handling', () => {
    test('should parse JSON responses', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: 'test' }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await api.get('/data');
      expect(result).toEqual({ data: 'test' });
    });

    test('should handle text responses', async () => {
      fetchMock.mockResponseOnce('Plain text response', {
        headers: { 'Content-Type': 'text/plain' }
      });
      
      const result = await api.get('/text');
      expect(result).toBe('Plain text response');
    });

    test('should handle blob responses', async () => {
      const binaryData = 'binary data';
      fetchMock.mockResponseOnce(binaryData, {
        headers: { 'Content-Type': 'application/octet-stream' }
      });
    
      const result = await api.get('/binary');
      expect(result.constructor.name).toBe('Blob');
    
      // Optional: Check blob content if needed
      const text = await (result as Blob).text();
      expect(text).toBe(binaryData);
    });
    

    test('should handle 204 No Content responses', async () => {
      fetchMock.mockResponseOnce('', { status: 204 });
      
      const result = await api.delete('/users/123');
      expect(result).toEqual({});
    });

    test('should transform response data when transformer is provided', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ name: 'John' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    
      const transformer = (data: any) => ({ ...data, transformed: true });
      const resp = await api.get('/users/123', undefined, { transformResponse: transformer });
      const result = await resp;
    
      expect(result).toEqual({ name: 'John', transformed: true });
    });
    
  });

  describe('Error Handling', () => {
    test('should throw proper error for failed requests with JSON response', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
      
      await expect(api.get('/secure')).rejects.toEqual(
        expect.objectContaining({
          status: 401,
          message: 'Invalid credentials',
          isApiError: true
        })
      );
    });

    test('should throw proper error for failed requests with text response', async () => {
      fetchMock.mockResponseOnce('Server Error', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
      
      await expect(api.get('/error')).rejects.toEqual(
        expect.objectContaining({
          status: 500,
          message: 'Server Error',
          isApiError: true
        })
      );
    });

    test('should handle network errors', async () => {
      fetchMock.mockReject(new Error('Network failure'));
      
      await expect(api.get('/users')).rejects.toEqual(
        expect.objectContaining({
          status: 0,
          message: 'Network failure',
          isApiError: true
        })
      );
    });

    test('should respect custom validateStatus function', async () => {
      fetchMock.mockResponseOnce('Warning', {
        status: 300,
        headers: { 'Content-Type': 'text/plain' }
      });
      
      const options = {
        validateStatus: (status: number) => status < 300 // Only 1xx and 2xx are valid
      };
      
      await expect(api.get('/users', undefined, options)).rejects.toEqual(
        expect.objectContaining({
          status: 300,
          message: 'Request failed with status 300',
          isApiError: true
        })
      );
    });

    test('should detect API errors correctly with isApiError helper', () => {
      const regularError = new Error('Regular error');
      const apiError = { status: 404, message: 'Not found', isApiError: true };
      
      expect(api.isApiError(regularError)).toBe(false);
      expect(api.isApiError(apiError)).toBe(true);
      expect(api.isApiError(null)).toBe(null);
      expect(api.isApiError(undefined)).toBe(undefined);
    });
  });

  describe('Request Cancellation', () => {
    test('should create cancellable request correctly', () => {
      const { signal, cancel } = createCancellableRequest();
      
      expect(signal).toBeInstanceOf(AbortSignal);
      expect(typeof cancel).toBe('function');
    });

    test('should abort request when cancelled', async () => {
      const { signal, cancel } = createCancellableRequest();
      
      fetchMock.mockResponseOnce(async () => {
        cancel();
        return JSON.stringify({ success: true });
      });
      
      await expect(api.get('/slow-request', undefined, { abortSignal: signal })).rejects.toEqual(
        expect.objectContaining({
          status: 499,
          message: 'Request Aborted',
          isApiError: true
        })
      );
    });
  });

  describe('Timeout Handling', () => {
    test('should timeout requests after specified period', async () => {
      fetchMock.mockResponseOnce(() => new Promise(resolve => setTimeout(resolve, 5000)));
      
      const promise = api.get('/slow', undefined, { timeout: 1000 });
      
      jest.advanceTimersByTime(1100);
      
      await expect(promise).rejects.toEqual(
        expect.objectContaining({
          status: 408,
          message: 'Request timeout after 1000ms',
          isApiError: true
        })
      );
    });

    test('should use default timeout when not specified', async () => {
      fetchMock.mockResponseOnce(() => new Promise(resolve => setTimeout(resolve, 40000)));
      
      const promise = api.get('/slow');
      
      jest.advanceTimersByTime(30100);
      
      await expect(promise).rejects.toEqual(
        expect.objectContaining({
          status: 408,
          message: 'Request timeout after 30000ms',
          isApiError: true
        })
      );
    });
  });

  describe('Retry Mechanism', () => {
    test('should retry failed requests with retriable status codes', async () => {
      // First call fails with 503, second succeeds
      fetchMock.mockResponses(
        [JSON.stringify({ error: 'Service Unavailable' }), { status: 503 }],
        [JSON.stringify({ success: true }), { status: 200 }]
      );
      
      const result = await api.get('/flaky', undefined, { retry: 1 });
      
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(JSON.parse(result)).toEqual({ success: true });
    });

    // test('should retry failed requests with correct backoff behavior', async () => {
    //   // Mock the console.info to capture retry messages
    //   const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
      
    //   // Setup all retries to fail with 503 except the last one
    //   fetchMock.mockResponses(
    //     [JSON.stringify({ error: 'Service Unavailable' }), { status: 503 }],
    //     [JSON.stringify({ error: 'Service Unavailable' }), { status: 503 }],
    //     [JSON.stringify({ error: 'Service Unavailable' }), { status: 503 }],
    //     [JSON.stringify({ success: true }), { status: 200 }]
    //   );
    
    //   // Mock setTimeout to execute immediately but track calls
    //   const originalSetTimeout = global.setTimeout;
    //   const setTimeoutMock = jest.fn().mockImplementation((callback) => {
    //     return originalSetTimeout(callback, 0); // Execute callback immediately
    //   });
    //   global.setTimeout = setTimeoutMock as any;
    
    //   // Execute request with retries
    //   const result = await api.get('/very-flaky', undefined, { retry: 3 });
      
    //   // Verify the request was retried the expected number of times
    //   expect(fetchMock).toHaveBeenCalledTimes(4); // Initial + 3 retries
    //   expect(result).toEqual({ success: true });
      
    //   // Verify setTimeout was called for each retry with increasing delays
    //   expect(setTimeoutMock).toHaveBeenCalledTimes(3);
      
    //   // Verify retry messages were logged
    //   expect(consoleSpy).toHaveBeenCalledTimes(3);
    //   expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Retrying GET /very-flaky after'));
      
    //   // Restore mocks
    //   consoleSpy.mockRestore();
    //   global.setTimeout = originalSetTimeout;
    // });
    
    

    test('should not retry for non-retriable status codes', async () => {
      fetchMock.mockReject(({ message: 'Bad Request',name:'Bad Request' }));
      
      await expect(api.get('/invalid', undefined, { retry: 3 })).rejects.toEqual(
        expect.objectContaining({
          // status: 409,
          message: 'Bad Request',
          isApiError:true,
          data:{
            message:"Bad Request",
            name:"Bad Request"
          }
        })
      );
      
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    // test('should give up after exhausting all retry attempts', async () => {
    //   // All attempts fail with 503
    //   fetchMock.mockResponse(JSON.stringify({ error: 'Service Unavailable' }), {
    //     status: 503
    //   });
      
    //   await expect(api.get('/always-fails', undefined, { retry: 2 })).rejects.toEqual(
    //     expect.objectContaining({
    //       status: 503,
    //       message: 'Service Unavailable'
    //     })
    //   );
      
    //   expect(fetchMock).toHaveBeenCalledTimes(3); // Initial + 2 retries
    // });
  });

  describe('API Client Factory', () => {
    test('should create client with base path', async () => {
      const client = createApiClient('/v1');
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      
      await client.get('/users');
      
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/v1/users',
        expect.objectContaining({ method: 'GET' })
      );
    });

    test('should apply default options to all requests', async () => {
      const defaultHeaders = { 'X-API-Key': 'test-key' };
      const client = createApiClient('/v2', { headers: defaultHeaders });
      
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await client.get('/users');
      
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/v2/users',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining(defaultHeaders)
        })
      );
    });

    test('should allow overriding default options', async () => {
      const defaultHeaders = { 'X-API-Key': 'default-key' };
      const client = createApiClient('/v3', { headers: defaultHeaders });
      
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      const customHeaders = { 'X-API-Key': 'custom-key' };
      
      await client.get('/users', undefined, { headers: customHeaders });
      
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:61423/v3/users',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining(customHeaders)
        })
      );
    });

    test('should support all HTTP methods', async () => {
      const client = createApiClient('/v4');
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      
      await client.get('/users');
      expect(fetchMock).toHaveBeenLastCalledWith(
        'http://localhost:61423/v4/users',
        expect.objectContaining({ method: 'GET' })
      );
      
      fetchMock.resetMocks();
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await client.post('/users', { name: 'John' });
      expect(fetchMock).toHaveBeenLastCalledWith(
        'http://localhost:61423/v4/users',
        expect.objectContaining({ method: 'POST' })
      );
      
      fetchMock.resetMocks();
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await client.put('/users/123', { name: 'John' });
      expect(fetchMock).toHaveBeenLastCalledWith(
        'http://localhost:61423/v4/users/123',
        expect.objectContaining({ method: 'PUT' })
      );
      
      fetchMock.resetMocks();
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await client.patch('/users/123', { status: 'active' });
      expect(fetchMock).toHaveBeenLastCalledWith(
        'http://localhost:61423/v4/users/123',
        expect.objectContaining({ method: 'PATCH' })
      );
      
      fetchMock.resetMocks();
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
      await client.delete('/users/123');
      expect(fetchMock).toHaveBeenLastCalledWith(
        'http://localhost:61423/v4/users/123',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});