import axios, { AxiosInstance } from 'axios';
import type {
  Workflow,
  VibeWorkflowRun,
  RunSubmission,
  SystemMetrics,
  PaginatedResponse,
} from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:31108/v0';

class FarmVibesAIClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Workflows
  async listWorkflows(): Promise<Workflow[]> {
    const response = await this.axiosInstance.get<Workflow[]>('/workflows');
    return response.data;
  }

  async describeWorkflow(workflowName: string): Promise<Workflow> {
    const response = await this.axiosInstance.get<Workflow>(
      `/workflows/${workflowName}`,
      { params: { return_format: 'description' } }
    );
    return response.data;
  }

  async getWorkflowYaml(workflowName: string): Promise<string> {
    const response = await this.axiosInstance.get(
      `/workflows/${workflowName}`,
      { params: { return_format: 'yaml' }, responseType: 'text' }
    );
    return response.data;
  }

  // Runs
  async submitRun(run: RunSubmission): Promise<VibeWorkflowRun> {
    const response = await this.axiosInstance.post<VibeWorkflowRun>('/runs', run);
    return response.data;
  }

  async getRun(runId: string): Promise<VibeWorkflowRun> {
    const response = await this.axiosInstance.get<VibeWorkflowRun>(`/runs/${runId}`);
    return response.data;
  }

  async listRuns(
    runIds?: string[],
    fields?: string[],
    skip = 0,
    take = 50
  ): Promise<PaginatedResponse<VibeWorkflowRun>> {
    const params: Record<string, unknown> = { skip, take };
    if (runIds && runIds.length > 0) {
      params.ids = runIds.join(',');
    }
    if (fields && fields.length > 0) {
      params.fields = fields.join(',');
    }

    const response = await this.axiosInstance.get<PaginatedResponse<VibeWorkflowRun>>(
      '/runs',
      { params }
    );
    return response.data;
  }

  async cancelRun(runId: string): Promise<void> {
    await this.axiosInstance.post(`/runs/${runId}/cancel`);
  }

  async deleteRun(runId: string): Promise<void> {
    await this.axiosInstance.delete(`/runs/${runId}`);
  }

  async resubmitRun(runId: string): Promise<VibeWorkflowRun> {
    const response = await this.axiosInstance.post<VibeWorkflowRun>(
      `/runs/${runId}/resubmit`
    );
    return response.data;
  }

  // System
  async getSystemMetrics(): Promise<SystemMetrics> {
    const response = await this.axiosInstance.get<SystemMetrics>('/system-metrics');
    return response.data;
  }
}

// Singleton instance
let clientInstance: FarmVibesAIClient | null = null;

export function getClient(): FarmVibesAIClient {
  if (!clientInstance) {
    clientInstance = new FarmVibesAIClient();
  }
  return clientInstance;
}

export function setClientUrl(url: string): void {
  clientInstance = new FarmVibesAIClient(url);
}

export default FarmVibesAIClient;
