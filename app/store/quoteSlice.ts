import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL || null;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || null;

interface Quote {
  id: number;
  content: string;
  author: string;
}

interface QuoteState {
  quote: Quote | null; 
  quotes: Quote[];
  last_page: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  token: string | null;
  error: string | null;
}

const initialState: QuoteState = {
  quote: {
    id: 0,
    content: 'If only wed stop trying to be happy wed have a pretty good time.',
    author: 'edith-wharton',
  }, 
  last_page: 0,
  quotes: [],
  status: 'idle',
  token: API_TOKEN,
  error: null,
};

export const fetchQuotes = createAsyncThunk<Quote, void, { rejectValue: string }>(
  'quotes/fetchQuotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/quotes/random`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched quote:', data);
      return data as Quote
    } catch (error: any) {
      error.message = error.message || 'Fa quote';
      console.log(error);
      
      return rejectWithValue(error.message || 'Failed to fetch quote');
    }
  }
);

export const saveQuote = createAsyncThunk<
  Quote,
  { content: string; author: string; token: string },
  { rejectValue: string }
>(
  'quotes/saveQuote',
  async ({ content, author, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content, author }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Saved quote:', data);
      return data as Quote;
    } catch (error: any) {
      console.error('Error saving quote:', error.message);
      return rejectWithValue(error.message || 'Failed to save quote');
    }
  }
);

export const GetFavoriteQuote = createAsyncThunk<
  { quotes: Quote[], last_page: number },
  { token: string }, 
  { rejectValue: string }
>(
  'quotes/getFavoriteQuotes',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/quotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched favorite quotes:', data);
      return { quotes: data.quotes.data as Quote[], last_page: data.quotes.last_page };
    } catch (error: any) {
      console.error('Error fetching favorite quotes:', error.message);
      return rejectWithValue(error.message || 'Failed to fetch favorite quotes');
    }
  }
);

export const deleteFavoriteQuote = createAsyncThunk<
  number,
  { id: number; token: string },
  { rejectValue: string }
>(
  'quotes/deleteFavoriteQuote',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8003/api/quotes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      return id;
    } catch (error: any) {
      console.error('Error deleting favorite quote:', error.message);
      return rejectWithValue(error.message || 'Failed to delete favorite quote');
    }
  }
);

const quoteSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    resetQuotes: (state) => {
      state.quote = null;
      state.quotes = [];
      state.status = 'idle';
      state.error = null;
      state.last_page = 0;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quote = action.payload; 
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(GetFavoriteQuote.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(GetFavoriteQuote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quotes = action.payload.quotes;
        state.last_page = action.payload.last_page;
      })
      .addCase(GetFavoriteQuote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(deleteFavoriteQuote.fulfilled, (state, action) => {
        state.quotes = state.quotes.filter(quote => quote.id !== action.payload);
      });
  },
});

export const { resetQuotes } = quoteSlice.actions;
export default quoteSlice.reducer;