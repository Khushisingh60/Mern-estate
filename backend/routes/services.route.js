import express from 'express';
import { 
  calculateLoan, 
  predictPrice, 
  analyzeInvestment,
  getMarketData 
} from '../controllers/services.controller.js';

const router = express.Router();

// Loan Calculator Routes
router.post('/loan-calculator', calculateLoan);

// Price Predictor Routes
router.post('/price-predictor', predictPrice);
router.get('/market-data', getMarketData);

// Investment Analyzer Routes
router.post('/investment-analyzer', analyzeInvestment);

export default router;