import { useState } from 'react';
import { FaHome, FaMoneyBillWave, FaChartLine, FaPercentage, FaCalculator } from 'react-icons/fa';

export default function InvestmentAnalyzer() {
  const [formData, setFormData] = useState({
    propertyPrice: 5000000,
    downPayment: 1000000,
    loanAmount: 4000000,
    interestRate: 8.5,
    loanTenure: 20,
    monthlyRent: 30000,
    appreciationRate: 5,
    maintenanceCost: 3000,
    propertyTax: 15000,
    investmentPeriod: 10
  });

  const [analysis, setAnalysis] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const analyzeInvestment = () => {
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
    } = formData;

    // Calculate EMI
    const ratePerMonth = interestRate / (12 * 100);
    const numberOfMonths = loanTenure * 12;
    const emi = (loanAmount * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) / 
                 (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);

    // Calculate future property value
    const futureValue = propertyPrice * Math.pow(1 + appreciationRate / 100, investmentPeriod);

    // Calculate total rental income
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
    const monthlyOutflow = emi + maintenanceCost + (propertyTax / 12);
    const breakEvenRent = monthlyOutflow;

    setAnalysis({
      emi: Math.round(emi),
      futureValue: Math.round(futureValue),
      totalRentalIncome: Math.round(totalRentalIncome),
      totalInvestment: Math.round(totalInvestment),
      netProfit: Math.round(netProfit),
      roi: roi.toFixed(2),
      annualizedReturn: annualizedReturn.toFixed(2),
      rentalYield: rentalYield.toFixed(2),
      monthlyCashFlow: Math.round(monthlyCashFlow),
      annualCashFlow: Math.round(annualCashFlow),
      breakEvenRent: Math.round(breakEvenRent),
      appreciation: Math.round(futureValue - propertyPrice)
    });
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lac`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getRecommendation = () => {
    if (!analysis) return null;

    const { roi, rentalYield, monthlyCashFlow } = analysis;

    if (roi > 50 && rentalYield > 4 && monthlyCashFlow > 0) {
      return { type: 'excellent', message: 'Excellent Investment Opportunity', color: 'green' };
    } else if (roi > 30 && rentalYield > 3) {
      return { type: 'good', message: 'Good Investment Potential', color: 'blue' };
    } else if (roi > 15) {
      return { type: 'moderate', message: 'Moderate Investment Returns', color: 'yellow' };
    } else {
      return { type: 'risky', message: 'Consider Other Options', color: 'red' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">Property Investment Analyzer</h1>
          <p className="text-slate-600">Make informed investment decisions with detailed ROI analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Investment Parameters</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Details */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <FaHome className="mr-2 text-purple-600" />
                  Property Details
                </h3>
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Property Price (₹)</label>
                <input
                  type="number"
                  name="propertyPrice"
                  value={formData.propertyPrice}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Down Payment (₹)</label>
                <input
                  type="number"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Loan Details */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 mt-4 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-blue-600" />
                  Loan Details
                </h3>
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Loan Amount (₹)</label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Interest Rate (%)</label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Loan Tenure (Years)</label>
                <input
                  type="number"
                  name="loanTenure"
                  value={formData.loanTenure}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Monthly Rent (₹)</label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Investment Parameters */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 mt-4 flex items-center">
                  <FaChartLine className="mr-2 text-green-600" />
                  Investment Parameters
                </h3>
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Appreciation Rate (% p.a.)</label>
                <input
                  type="number"
                  name="appreciationRate"
                  value={formData.appreciationRate}
                  onChange={handleInputChange}
                  step="0.5"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Investment Period (Years)</label>
                <input
                  type="number"
                  name="investmentPeriod"
                  value={formData.investmentPeriod}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Monthly Maintenance (₹)</label>
                <input
                  type="number"
                  name="maintenanceCost"
                  value={formData.maintenanceCost}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium mb-2 block">Annual Property Tax (₹)</label>
                <input
                  type="number"
                  name="propertyTax"
                  value={formData.propertyTax}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <button
              onClick={analyzeInvestment}
              className="w-full mt-8 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              Analyze Investment
            </button>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Metrics</h3>
              
              {analysis ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90 mb-1">Total ROI</p>
                    <p className="text-3xl font-bold">{analysis.roi}%</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90 mb-1">Rental Yield</p>
                    <p className="text-3xl font-bold">{analysis.rentalYield}%</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90 mb-1">Annualized Return</p>
                    <p className="text-3xl font-bold">{analysis.annualizedReturn}%</p>
                  </div>

                  {getRecommendation() && (
                    <div className={`bg-${getRecommendation().color}-50 border-2 border-${getRecommendation().color}-200 rounded-lg p-4`}>
                      <p className={`text-${getRecommendation().color}-800 font-semibold text-center`}>
                        {getRecommendation().message}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <FaCalculator className="text-5xl mx-auto mb-3" />
                  <p>Enter details to see metrics</p>
                </div>
              )}
            </div>

            {analysis && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Cash Flow</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Monthly EMI</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(analysis.emi)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Monthly Cash Flow</span>
                    <span className={`font-semibold ${analysis.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(analysis.monthlyCashFlow))}
                      {analysis.monthlyCashFlow >= 0 ? ' +' : ' -'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-slate-600">Break-even Rent</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(analysis.breakEvenRent)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Analysis */}
        {analysis && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Detailed Investment Analysis</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(analysis.totalInvestment)}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-600 mb-1">Total Returns</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(analysis.futureValue + analysis.totalRentalIncome)}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-purple-600 mb-1">Net Profit</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(analysis.netProfit)}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-600 mb-1">Property Appreciation</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(analysis.appreciation)}</p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <p className="text-sm text-indigo-600 mb-1">Total Rental Income</p>
                <p className="text-2xl font-bold text-indigo-900">{formatCurrency(analysis.totalRentalIncome)}</p>
              </div>

              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                <p className="text-sm text-pink-600 mb-1">Future Property Value</p>
                <p className="text-2xl font-bold text-pink-900">{formatCurrency(analysis.futureValue)}</p>
              </div>

              <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                <p className="text-sm text-teal-600 mb-1">Annual Cash Flow</p>
                <p className={`text-2xl font-bold ${analysis.annualCashFlow >= 0 ? 'text-teal-900' : 'text-red-900'}`}>
                  {formatCurrency(Math.abs(analysis.annualCashFlow))}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-yellow-600 mb-1">Rental Yield</p>
                <p className="text-2xl font-bold text-yellow-900">{analysis.rentalYield}%</p>
              </div>
            </div>

            {/* Investment Insights */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-semibold text-slate-800 mb-3">Cash Flow Analysis</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Your property generates {analysis.monthlyCashFlow >= 0 ? 'positive' : 'negative'} monthly cash flow of {formatCurrency(Math.abs(analysis.monthlyCashFlow))}.
                </p>
                <p className="text-sm text-slate-600">
                  {analysis.monthlyCashFlow >= 0 
                    ? 'This property is cash-flow positive from day one!' 
                    : 'Consider this as a long-term appreciation play.'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-semibold text-slate-800 mb-3">Return Comparison</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Your annualized return of {analysis.annualizedReturn}% 
                  {analysis.annualizedReturn > 12 ? ' exceeds' : ' is below'} typical market returns (10-12%).
                </p>
                <p className="text-sm text-slate-600">
                  {analysis.roi > 50 ? 'Excellent investment opportunity!' : 'Compare with other investment options.'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-semibold text-slate-800 mb-3">Rental Yield Insight</h4>
                <p className="text-sm text-slate-600 mb-2">
                  A rental yield of {analysis.rentalYield}% is 
                  {analysis.rentalYield > 4 ? ' excellent' : analysis.rentalYield > 3 ? ' good' : ' moderate'}.
                </p>
                <p className="text-sm text-slate-600">
                  Typical rental yields in Indian metros range from 2-4%.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}