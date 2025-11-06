import { useState } from 'react';
import { FaHome, FaPercent, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [results, setResults] = useState(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const numberOfMonths = parseFloat(loanTenure) * 12;

    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) / 
                 (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);

    const totalAmount = emi * numberOfMonths;
    const totalInterest = totalAmount - principal;

    setResults({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal)
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">House Loan Calculator</h1>
          <p className="text-slate-600">Calculate your home loan EMI and plan your finances</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Loan Details</h2>

            {/* Loan Amount */}
            <div className="mb-6">
              <label className="flex items-center text-slate-700 font-medium mb-2">
                <FaHome className="mr-2 text-blue-600" />
                Loan Amount
              </label>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 w-40 focus:outline-none focus:border-blue-500"
                />
                <span className="text-slate-600 font-medium">{formatCurrency(loanAmount)}</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-6">
              <label className="flex items-center text-slate-700 font-medium mb-2">
                <FaPercent className="mr-2 text-green-600" />
                Interest Rate (% per annum)
              </label>
              <input
                type="range"
                min="5"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  step="0.1"
                  className="border border-slate-300 rounded-lg px-3 py-2 w-40 focus:outline-none focus:border-green-500"
                />
                <span className="text-slate-600 font-medium">{interestRate}%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="mb-8">
              <label className="flex items-center text-slate-700 font-medium mb-2">
                <FaCalendarAlt className="mr-2 text-purple-600" />
                Loan Tenure (Years)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 w-40 focus:outline-none focus:border-purple-500"
                />
                <span className="text-slate-600 font-medium">{loanTenure} Years</span>
              </div>
            </div>

            <button
              onClick={calculateEMI}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Calculate EMI
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Calculation Results</h2>

            {results ? (
              <div>
                {/* EMI Display */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-6 text-white">
                  <p className="text-sm opacity-90 mb-2">Monthly EMI</p>
                  <p className="text-4xl font-bold">{formatCurrency(results.emi)}</p>
                </div>

                {/* Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <span className="text-slate-600 font-medium">Principal Amount</span>
                    <span className="text-slate-800 font-semibold">{formatCurrency(results.principal)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <span className="text-slate-600 font-medium">Total Interest</span>
                    <span className="text-slate-800 font-semibold">{formatCurrency(results.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <span className="text-green-700 font-medium">Total Amount Payable</span>
                    <span className="text-green-800 font-bold text-xl">{formatCurrency(results.totalAmount)}</span>
                  </div>
                </div>

                {/* Visual Breakdown */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Payment Breakdown</h3>
                  <div className="flex rounded-lg overflow-hidden h-8">
                    <div
                      style={{ width: `${(results.principal / results.totalAmount) * 100}%` }}
                      className="bg-blue-500 flex items-center justify-center text-white text-xs font-semibold"
                    >
                      {Math.round((results.principal / results.totalAmount) * 100)}%
                    </div>
                    <div
                      style={{ width: `${(results.totalInterest / results.totalAmount) * 100}%` }}
                      className="bg-orange-500 flex items-center justify-center text-white text-xs font-semibold"
                    >
                      {Math.round((results.totalInterest / results.totalAmount) * 100)}%
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded mr-2"></span>
                      Principal
                    </span>
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-orange-500 rounded mr-2"></span>
                      Interest
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <FaRupeeSign className="text-6xl mb-4" />
                <p className="text-lg">Enter loan details and click "Calculate EMI"</p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">About Home Loans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">EMI (Equated Monthly Installment)</h4>
              <p className="text-sm">The fixed monthly payment you make to repay your home loan, consisting of both principal and interest.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Interest Rate</h4>
              <p className="text-sm">The percentage charged by the lender on the loan amount. Lower rates mean lower overall costs.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Loan Tenure</h4>
              <p className="text-sm">The duration over which you'll repay the loan. Longer tenure means lower EMI but higher total interest.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}