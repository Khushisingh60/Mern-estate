const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Loan Calculator API
export const calculateLoanAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/loan-calculator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to calculate loan');
    }

    return result.data;
  } catch (error) {
    console.error('Error calculating loan:', error);
    throw error;
  }
};

// Price Predictor API
export const predictPriceAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/price-predictor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to predict price');
    }

    return result.data;
  } catch (error) {
    console.error('Error predicting price:', error);
    throw error;
  }
};

// Investment Analyzer API
export const analyzeInvestmentAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/investment-analyzer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to analyze investment');
    }

    return result.data;
  } catch (error) {
    console.error('Error analyzing investment:', error);
    throw error;
  }
};

// Get Market Data API
export const getMarketDataAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/market-data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch market data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};