// Calculate Loan EMI
export const calculateLoan = async (req, res) => {
  try {
    const { loanAmount, interestRate, loanTenure } = req.body;

    // Validation
    if (!loanAmount || !interestRate || !loanTenure) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const principal = parseFloat(loanAmount);
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const numberOfMonths = parseFloat(loanTenure) * 12;

    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) / 
                 (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);

    const totalAmount = emi * numberOfMonths;
    const totalInterest = totalAmount - principal;

    // Generate amortization schedule
    let balance = principal;
    const schedule = [];
    
    for (let i = 1; i <= Math.min(numberOfMonths, 12); i++) {
      const interestPayment = balance * ratePerMonth;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(balance)
      });
    }

    res.status(200).json({
      success: true,
      data: {
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        principal: Math.round(principal),
        schedule: schedule
      }
    });

  } catch (error) {
    console.error('Error in calculateLoan:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while calculating loan' 
    });
  }
};

// Predict Property Price
export const predictPrice = async (req, res) => {
  try {
    const { 
      location, 
      propertyType, 
      bedrooms, 
      bathrooms, 
      sqft, 
      age, 
      parking, 
      amenities 
    } = req.body;

    // Validation
    if (!location || !propertyType || !sqft) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Location base prices (per sqft)
    const locationPrices = {
      'South Delhi': 15000,
      'Gurgaon': 12000,
      'Noida': 8000,
      'Mumbai - Andheri': 18000,
      'Mumbai - Bandra': 25000,
      'Bangalore - Whitefield': 9000,
      'Bangalore - Koramangala': 12000,
      'Pune - Hinjewadi': 7000,
      'Hyderabad - Gachibowli': 8500,
      'Chennai - OMR': 7500
    };

    let basePrice = locationPrices[location] || 10000;

    // Property type multiplier
    const typeMultipliers = {
      apartment: 1,
      villa: 1.4,
      penthouse: 1.8,
      studio: 0.7
    };

    let pricePerSqft = basePrice * (typeMultipliers[propertyType] || 1);
    
    // Feature adjustments
    pricePerSqft += (bedrooms * 500);
    pricePerSqft += (bathrooms * 300);
    pricePerSqft += (parking * 200);
    pricePerSqft += ((amenities?.length || 0) * 400);
    
    // Age depreciation (2% per year)
    const ageDepreciation = Math.max(0, 1 - (age * 0.02));
    pricePerSqft *= ageDepreciation;

    const totalPrice = Math.round(pricePerSqft * sqft);
    const minPrice = Math.round(totalPrice * 0.92);
    const maxPrice = Math.round(totalPrice * 1.08);

    // Calculate confidence based on data completeness
    let confidence = 75;
    if (amenities && amenities.length > 0) confidence += 5;
    if (parking > 0) confidence += 3;
    if (age < 10) confidence += 5;
    confidence = Math.min(confidence + Math.floor(Math.random() * 8), 95);

    res.status(200).json({
      success: true,
      data: {
        estimatedPrice: totalPrice,
        minPrice,
        maxPrice,
        pricePerSqft: Math.round(pricePerSqft),
        confidence,
        location,
        propertyType
      }
    });

  } catch (error) {
    console.error('Error in predictPrice:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while predicting price' 
    });
  }
};

// Analyze Investment
export const analyzeInvestment = async (req, res) => {
  try {
    const {
      propertyPrice,
      downPayment,
      loanAmount,
      interestRate,
      loanTenure,
      monthlyRent,
      appreciationRate,
      maintenanceCost,
      propertyTax,
      investmentPeriod
    } = req.body;

    // Validation
    if (!propertyPrice || !downPayment || !loanAmount || !interestRate || !loanTenure) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Calculate EMI
    const ratePerMonth = interestRate / (12 * 100);
    const numberOfMonths = loanTenure * 12;
    const emi = (loanAmount * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) / 
                 (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);

    // Calculate future property value
    const futureValue = propertyPrice * Math.pow(1 + appreciationRate / 100, investmentPeriod);

    // Calculate rental income
    const monthlyExpenses = maintenanceCost + (propertyTax / 12);
    const netMonthlyRent = monthlyRent - monthlyExpenses;
    const annualRentalIncome = netMonthlyRent * 12;
    const totalRentalIncome = annualRentalIncome * investmentPeriod;

    // Calculate total investment
    const totalInvestment = downPayment + (emi * 12 * Math.min(investmentPeriod, loanTenure));

    // Calculate returns
    const totalReturns = futureValue + totalRentalIncome;
    const netProfit = totalReturns - totalInvestment;
    const roi = ((netProfit / totalInvestment) * 100);
    const annualizedReturn = (Math.pow(totalReturns / totalInvestment, 1 / investmentPeriod) - 1) * 100;

    // Calculate rental yield
    const rentalYield = ((monthlyRent * 12) / propertyPrice) * 100;

    // Cash flow analysis
    const monthlyCashFlow = netMonthlyRent - emi;
    const annualCashFlow = monthlyCashFlow * 12;

    // Break-even analysis
    const breakEvenRent = emi + monthlyExpenses;

    // Generate year-wise projection
    const yearlyProjection = [];
    let remainingLoan = loanAmount;
    
    for (let year = 1; year <= investmentPeriod; year++) {
      const yearlyPrincipal = Math.min(emi * 12, remainingLoan);
      remainingLoan = Math.max(0, remainingLoan - yearlyPrincipal);
      
      const propertyValueAtYear = propertyPrice * Math.pow(1 + appreciationRate / 100, year);
      const rentalIncomeAtYear = annualRentalIncome * year;
      
      yearlyProjection.push({
        year,
        propertyValue: Math.round(propertyValueAtYear),
        cumulativeRent: Math.round(rentalIncomeAtYear),
        remainingLoan: Math.round(remainingLoan),
        equity: Math.round(propertyValueAtYear - remainingLoan)
      });
    }

    // Recommendation
    let recommendation = 'moderate';
    if (roi > 50 && rentalYield > 4 && monthlyCashFlow > 0) {
      recommendation = 'excellent';
    } else if (roi > 30 && rentalYield > 3) {
      recommendation = 'good';
    } else if (roi < 15) {
      recommendation = 'risky';
    }

    res.status(200).json({
      success: true,
      data: {
        emi: Math.round(emi),
        futureValue: Math.round(futureValue),
        totalRentalIncome: Math.round(totalRentalIncome),
        totalInvestment: Math.round(totalInvestment),
        totalReturns: Math.round(totalReturns),
        netProfit: Math.round(netProfit),
        roi: parseFloat(roi.toFixed(2)),
        annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
        rentalYield: parseFloat(rentalYield.toFixed(2)),
        monthlyCashFlow: Math.round(monthlyCashFlow),
        annualCashFlow: Math.round(annualCashFlow),
        breakEvenRent: Math.round(breakEvenRent),
        appreciation: Math.round(futureValue - propertyPrice),
        yearlyProjection,
        recommendation
      }
    });

  } catch (error) {
    console.error('Error in analyzeInvestment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while analyzing investment' 
    });
  }
};

// Get Market Data
export const getMarketData = async (req, res) => {
  try {
    const marketData = {
      averageInterestRates: {
        sbi: 8.5,
        hdfc: 8.6,
        icici: 8.55,
        axis: 8.65
      },
      locationData: [
        { location: 'South Delhi', avgPrice: 15000, growth: 8.5 },
        { location: 'Gurgaon', avgPrice: 12000, growth: 10.2 },
        { location: 'Noida', avgPrice: 8000, growth: 12.5 },
        { location: 'Mumbai - Andheri', avgPrice: 18000, growth: 7.8 },
        { location: 'Mumbai - Bandra', avgPrice: 25000, growth: 6.5 },
        { location: 'Bangalore - Whitefield', avgPrice: 9000, growth: 11.0 },
        { location: 'Bangalore - Koramangala', avgPrice: 12000, growth: 9.5 },
        { location: 'Pune - Hinjewadi', avgPrice: 7000, growth: 13.2 },
        { location: 'Hyderabad - Gachibowli', avgPrice: 8500, growth: 10.8 },
        { location: 'Chennai - OMR', avgPrice: 7500, growth: 9.2 }
      ],
      rentalYields: {
        tier1Cities: { min: 2.5, max: 4.0, avg: 3.2 },
        tier2Cities: { min: 3.5, max: 5.5, avg: 4.5 }
      },
      marketTrends: {
        currentQuarter: 'Q4 2024',
        overallGrowth: 9.2,
        demandSupplyRatio: 1.3,
        sentiment: 'positive'
      }
    };

    res.status(200).json({
      success: true,
      data: marketData
    });

  } catch (error) {
    console.error('Error in getMarketData:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching market data' 
    });
  }
};