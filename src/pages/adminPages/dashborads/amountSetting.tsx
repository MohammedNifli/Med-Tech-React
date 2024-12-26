import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 

  StethoscopeIcon, 
  UserIcon, 
  BarChart3Icon,
  TrendingUpIcon,
  GlobeIcon,
  ShieldIcon,
  SaveIcon,
  BanknoteIcon
} from 'lucide-react';
import axiosInstance from '@/utils/axiosClient';

const AmountSetting: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Revenue");
  const [selectedPeriod, setSelectedPeriod] = useState("yearly");
  
  // State for each amount type
  const [onlineAmount, setOnlineAmount] = useState(0);
  const [offlineAmount, setOfflineAmount] = useState(0);
  const [premiumAmount, setPremiumAmount] = useState(0);
  
  // State to control input visibility
  const [showOnlineInput, setShowOnlineInput] = useState(false);
  const [showOfflineInput, setShowOfflineInput] = useState(false);
  const [showPremiumInput, setShowPremiumInput] = useState(false);
  
  // Temporary input state
  const [tempOnlineAmount, setTempOnlineAmount] = useState('');
  const [tempOfflineAmount, setTempOfflineAmount] = useState('');
  const [tempPremiumAmount, setTempPremiumAmount] = useState('');

  const handleClick = (tab: string, url: string) => {
    setActiveTab(tab);
    navigate(url);
  };


  useEffect(()=>{
    const fetchAmounts=async()=>{
      const addedAmounts=await axiosInstance.get('/admin/amounts')
      console.log("amouunts",addedAmounts.data.amounts)
      setOfflineAmount(addedAmounts?.data?.amounts?.offlineShare)
      setOnlineAmount(addedAmounts?.data?.amounts?.onlineShare)
      setPremiumAmount(addedAmounts?.data?.amounts?.premiumAmount)

    }
    fetchAmounts()
  },[])

  // Function to handle saving new amount
  const handleSaveAmount = async (type: 'online' | 'offline' | 'premium') => {
    try {
      let response;
  
      switch (type) {
        case 'online':
          // Make API call to save online amount
          response = await axiosInstance.post('/admin/online', { amount: tempOnlineAmount });
          if (response?.data?.success) {
            setOnlineAmount(Number(tempOnlineAmount)); // Update state
          }
          setShowOnlineInput(false);
          setTempOnlineAmount(''); // Clear input
          break;
  
        case 'offline':
          // Make API call to save offline amount
          response = await axiosInstance.post('/admin/offline', { amount: tempOfflineAmount });
          if (response?.data?.success) {
            setOfflineAmount(Number(tempOfflineAmount)); // Update state
          }
          setShowOfflineInput(false);
          setTempOfflineAmount(''); // Clear input
          break;
  
        case 'premium':
          // Make API call to save premium amount
          response = await axiosInstance.post('/admin/premium', { amount: tempPremiumAmount });
          if (response?.data?.success) {
            setPremiumAmount(Number(tempPremiumAmount)); // Update state
          }
          setShowPremiumInput(false);
          setTempPremiumAmount(''); // Clear input
          break;
  
        default:
          console.warn('Invalid type');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error saving amount:', error);
    }
  };
  

  return (
    <div className='bg-gray-50 min-h-screen p-8'>
      {/* Period Selection */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <select
            className="p-3 border-2 border-blue-200 rounded-lg text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <TrendingUpIcon className="w-5 h-5" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8">
        {[
          { name: "overview", icon: <CalendarIcon />, label: "Overview", url: "/admin/dashboard" },
          { name: "doctors", icon: <StethoscopeIcon />, label: "Doctors", url: "/admin/doctor/dash" },
          { name: "patients", icon: <UserIcon />, label: "Patients", url: "/admin/patient/dash" },
          { name: "Revenue",  icon:<BanknoteIcon />, label: "Amount Setting" ,url: "" }
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleClick(tab.name, tab.url)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
              ${activeTab === tab.name 
                ? "bg-blue-500 text-white shadow-md" 
                : "hover:bg-blue-100 text-gray-600 hover:text-blue-700"}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Shares Section */}
      <div className='grid grid-cols-3 gap-8'>
        {/* Online Amount */}
        <div 
          className='bg-white rounded-2xl shadow-xl border-2 border-blue-50 p-6 transform transition-all hover:scale-105 hover:shadow-2xl'
        >
          <div className='flex flex-col items-center text-center'>
            <GlobeIcon className="text-blue-500 w-12 h-12 mb-4" />
            <h4 className="text-2xl font-bold mb-2 text-gray-800">Online Amount</h4>
            <p className="text-gray-500 mb-4">Online Membership Revenue</p>
            
            <div className="w-full bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-700">Added Amount:</span>
                <span className="text-green-600 font-bold text-xl">₹{onlineAmount}</span>
              </div>
            </div>

            {!showOnlineInput ? (
              <button 
                className="w-full py-3 bg-blue-500 text-white rounded-lg 
                  hover:bg-blue-600 transition-colors 
                  flex items-center justify-center 
                  font-bold space-x-2"
                onClick={() => setShowOnlineInput(true)}
              >
                <TrendingUpIcon className="w-5 h-5" />
                <span>Add Amount</span>
              </button>
            ) : (
              <div className="w-full space-y-2">
                <input 
                  type="number" 
                  value={tempOnlineAmount}
                  onChange={(e) => setTempOnlineAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter new amount"
                />
                <div className="flex space-x-2">
                  <button 
                    className="w-1/2 py-2 bg-green-500 text-white rounded-lg 
                      hover:bg-green-600 transition-colors 
                      flex items-center justify-center 
                      font-bold space-x-2"
                    onClick={() => handleSaveAmount('online')}
                  >
                    <SaveIcon className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                  <button 
                    className="w-1/2 py-2 bg-red-500 text-white rounded-lg 
                      hover:bg-red-600 transition-colors 
                      flex items-center justify-center 
                      font-bold space-x-2"
                    onClick={() => {
                      setShowOnlineInput(false);
                      setTempOnlineAmount('');
                    }}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Offline Amount */}
        <div 
          className='bg-white rounded-2xl shadow-xl border-2 border-blue-50 p-6 transform transition-all hover:scale-105 hover:shadow-2xl'
        >
          <div className='flex flex-col items-center text-center'>
            <BarChart3Icon className="text-green-500 w-12 h-12 mb-4" />
            <h4 className="text-2xl font-bold mb-2 text-gray-800">Offline Amount</h4>
            <p className="text-gray-500 mb-4">Offline Membership Revenue</p>
            
            <div className="w-full bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-700">Added Amount:</span>
                <span className="text-green-600 font-bold text-xl">₹{offlineAmount}</span>
              </div>
            </div>

            {!showOfflineInput ? (
              <button 
                className="w-full py-3 bg-blue-500 text-white rounded-lg 
                  hover:bg-blue-600 transition-colors 
                  flex items-center justify-center 
                  font-bold space-x-2"
                onClick={() => setShowOfflineInput(true)}
              >
                <TrendingUpIcon className="w-5 h-5" />
                <span>Add Amount</span>
              </button>
            ) : (
              <div className="w-full space-y-2">
                <input 
                  type="number" 
                  value={tempOfflineAmount}
                  onChange={(e) => setTempOfflineAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter new amount"
                />
                <div className="flex space-x-2">
                  <button 
                    className="w-1/2 py-2 bg-green-500 text-white rounded-lg 
                      hover:bg-green-600 transition-colors 
                      flex items-center justify-center 
                      font-bold space-x-2"
                    onClick={() => handleSaveAmount('offline')}
                  >
                    <SaveIcon className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                  <button 
                    className="w-1/2 py-2 bg-red-500 text-white rounded-lg 
                      hover:bg-red-600 transition-colors 
                      flex items-center justify-center 
                      font-bold space-x-2"
                    onClick={() => {
                      setShowOfflineInput(false);
                      setTempOfflineAmount('');
                    }}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Amount */}
        <div 
          className='bg-white rounded-2xl shadow-xl border-2 border-blue-50 p-6 transform transition-all hover:scale-105 hover:shadow-2xl'
        >
          <div className='flex flex-col items-center text-center'>
            <ShieldIcon className="text-purple-500 w-12 h-12 mb-4" />
            <h4 className="text-2xl font-bold mb-2 text-gray-800">Premium Amount</h4>
            <p className="text-gray-500 mb-4">Premium Membership Revenue</p>
            
            <div className="w-full bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-700">Added Amount:</span>
                <span className="text-green-600 font-bold text-xl">₹{premiumAmount}</span>
              </div>
            </div>

            {!showPremiumInput ? (
              <button 
                className="w-full py-3 bg-blue-500 text-white rounded-lg 
                  hover:bg-blue-600 transition-colors 
                  flex items-center justify-center 
                  font-bold space-x-2"
                onClick={() => setShowPremiumInput(true)}
              >
                <TrendingUpIcon className="w-5 h-5" />
                <span>Add Amount</span>
              </button>
            ) : (
              <div className="w-full space-y-2">
                <input 
                  type="number" 
                  value={tempPremiumAmount}
                  onChange={(e) => setTempPremiumAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter new amount"
                />
                <div className="flex space-x-2">
                  <button 
                    className="w-1/2 py-2 bg-green-500 text-white rounded-lg 
                      hover:bg-green-600 transition-colors 
                      flex items-center justify-center 
                      font-bold space-x-2"
                    onClick={() => handleSaveAmount('premium')}
                  >
                    <SaveIcon className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                  <button 
                    className="w-1/2 py-2 bg-red-500 text-white rounded-lg 
                      hover:bg-red-600 transition-colors 
                      flex items-center justify-center 
                      font-bold space-x-2"
                    onClick={() => {
                      setShowPremiumInput(false);
                      setTempPremiumAmount('');
                    }}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmountSetting;