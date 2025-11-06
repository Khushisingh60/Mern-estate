import { useNavigate } from 'react-router-dom';
import { FaCalculator, FaChartLine, FaHandHoldingUsd } from 'react-icons/fa';

// Note: Make sure react-icons is installed: npm install react-icons

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: 'House Loan Calculator',
      description: 'Calculate your monthly EMI, total interest, and loan repayment schedule with our comprehensive loan calculator.',
      icon: <FaCalculator className="text-6xl text-blue-600" />,
      path: '/services/loan-calculator',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 2,
      title: 'Home Price Predictor',
      description: 'Get accurate property price predictions based on location, size, amenities, and market trends using ML algorithms.',
      icon: <FaChartLine className="text-6xl text-green-600" />,
      path: '/services/price-predictor',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 3,
      title: 'Property Investment Analyzer',
      description: 'Analyze potential returns, rental yields, and investment opportunities to make informed property investment decisions.',
      icon: <FaHandHoldingUsd className="text-6xl text-purple-600" />,
      path: '/services/investment-analyzer',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">Our Services</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore our suite of powerful tools designed to help you make informed real estate decisions
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(service.path)}
              className={`${service.bgColor} ${service.hoverColor} rounded-xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">{service.icon}</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{service.title}</h2>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
                <button className="mt-6 bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Why Choose Our Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Accurate Results</h3>
              <p className="text-slate-600">Our tools use advanced algorithms and real-time data to provide precise calculations</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Easy to Use</h3>
              <p className="text-slate-600">User-friendly interfaces designed for both beginners and experienced investors</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Free Access</h3>
              <p className="text-slate-600">All our services are completely free to use with no hidden charges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}