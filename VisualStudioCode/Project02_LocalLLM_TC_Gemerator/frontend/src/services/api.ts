import axios, { AxiosInstance } from 'axios';
import { GenerateTestsRequest, GenerateTestsResponse, ProviderConfig } from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async generateTestCases(
    request: GenerateTestsRequest
  ): Promise<GenerateTestsResponse> {
    try {
      const response = await this.client.post<GenerateTestsResponse>(
        '/api/generate-tests',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || error.message,
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }

  async getProviders(): Promise<ProviderConfig[]> {
    try {
      const response = await this.client.get<{ providers: ProviderConfig[] }>(
        '/api/providers'
      );
      return response.data.providers;
    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
