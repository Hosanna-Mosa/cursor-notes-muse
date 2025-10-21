import { Note } from '@/types/note';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

interface NotesResponse {
  success: boolean;
  data: Note[];
  count: number;
  total: number;
  page: number;
  pages: number;
}

interface NoteResponse {
  success: boolean;
  data: Note;
}

// API Error class
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// Notes API functions
export const notesApi = {
  // Get all notes with optional search and pagination
  async getNotes(params?: {
    q?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<NotesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.q) searchParams.append('q', params.q);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/notes?${queryString}` : '/notes';
    
    return apiRequest<NotesResponse>(endpoint);
  },

  // Get single note by ID
  async getNote(id: string): Promise<NoteResponse> {
    return apiRequest<NoteResponse>(`/notes/${id}`);
  },

  // Create new note
  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteResponse> {
    return apiRequest<NoteResponse>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  // Update existing note
  async updateNote(id: string, note: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): Promise<NoteResponse> {
    return apiRequest<NoteResponse>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  },

  // Delete note
  async deleteNote(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },

  // Delete all notes
  async deleteAllNotes(): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>('/notes', {
      method: 'DELETE',
    });
  },

  // Get notes statistics
  async getStats(): Promise<{
    success: boolean;
    data: {
      totalNotes: number;
      recentNotes: number;
      lastUpdated: string;
    };
  }> {
    return apiRequest('/notes/stats');
  },

  // Health check
  async healthCheck(): Promise<{
    status: string;
    message: string;
    timestamp: string;
    environment: string;
  }> {
    return apiRequest('/health');
  },
};

// Utility functions
export const apiUtils = {
  // Check if API is available
  async isApiAvailable(): Promise<boolean> {
    try {
      await notesApi.healthCheck();
      return true;
    } catch {
      return false;
    }
  },

  // Handle API errors with user-friendly messages
  getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 404:
          return 'Note not found.';
        case 500:
          return 'Server error. Please try again later.';
        case 0:
          return 'Network error. Please check your connection.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }
    
    return 'An unexpected error occurred.';
  },

  // Retry function for failed requests
  async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: unknown;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }
    
    throw lastError;
  },
};

export { ApiError };
export default notesApi;
