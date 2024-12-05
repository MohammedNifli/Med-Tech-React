    import React, { useEffect, useState } from 'react';
    import { AiOutlineWallet, AiOutlineLineChart } from 'react-icons/ai';
    import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
    import Sidebar from '../../components/user/Sider';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { RootState } from '../../reduxStore/store';

    const PaymentPage: React.FC = () => {

      const userId=useSelector((state:RootState)=>state.auth.user?._id)

      const [balance,SetBalance]=useState(0)
      useEffect(() => {
        const fetchWalletDetails = async () => {
          if (userId) {
            try {
              const response = await axios.get(`http://localhost:4444/wallet/fetch-wallet?id=${userId}`);
              console.log("Wallet response:", response.data);
              SetBalance(response.data.walletData.balance)
            } catch (error) {
              console.error("Error fetching wallet details:", error);
            }
          }
        };
    
        fetchWalletDetails();
      }, [userId]); 
      return (
        <>
          <div className="mt-24 h-screen w-full bg-white">
            <div className="flex h-full">
              <div className="flex w-1/6 bg-white h-full">
                <Sidebar />
              </div>
              <div
                id="Hoo"
                className="flex rounded-lg mt-5 ml-3 mr-3 w-5/6 h-64 bg-white relative shadow-lg"
              >
                {/* Card and Image Section */}
                <div
                  id="card-div"
                  className="w-[350px] h-[200px] ml-7 mt-7 bg-gradient-to-br from-gray-800 to-blue-900 p-5 rounded-lg shadow-lg relative"
                >
                  {/* Wallet Icon and Date */}
                  <div className="flex items-center justify-between mb-4">
                    <AiOutlineWallet className="text-gray-400 text-2xl" />
                    <p className="text-gray-400 text-sm">Today</p>
                  </div>

                  {/* Balance Display */}
                  <h2 className="text-white text-3xl font-bold">INR {balance}</h2>

                  {/* Growth Percentage */}
                  <p className="text-green-400 mt-1 text-sm">
                    + $170.25 <span className="text-green-400">(22.1%)</span>{' '}
                    <span className="text-green-400">&#x2191;</span>
                  </p>

                  {/* Chart Icon Button */}
                  <div className="absolute bottom-4 right-4 bg-purple-500 p-3 rounded-full shadow-md">
                    <AiOutlineLineChart className="text-white text-lg" />
                  </div>
                </div>

                {/* Withdraw Button */}
                <div
                  id="withdraw"
                  className="absolute bottom-4 left-[400px] flex items-center justify-center"
                >
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition duration-200">
                    Withdraw
                  </button>
                </div>

                {/* Last Section with Image and Quote */}
                <div className="absolute bottom-0 right-0 p-5 flex items-center bg-white bg-opacity-60 rounded-lg shadow-sm">
                  <div
                    className="w-[200px] h-[200px] bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: 'url(/pictures/payment-safe.jpg)' }}
                  />
                  <div className="ml-6">
                    <p className="text-lg font-semibold text-gray-800">
                      Your transaction is our responsibility
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition duration-200">
                      See Transaction History
                    </button>
                  </div>
                </div>

                {/* Box Component */}
                <Box
                  position="absolute"
                  top="calc(100% + 20px)"
                  zIndex={10}
                  bg="white shadow"
                  p={4}
                  borderRadius="md"
                  className='w-full mt-10 shadow-lg '
                >
                  <TableContainer>
                    <Table variant="striped" colorScheme="gray" borderColor="gray.200">
                      <Thead >
                        <Tr  borderBottom="2px" borderColor="gray.200">
                          <Th>No</Th>
                          <Th>Name</Th>
                          <Th>Date</Th>
                          <Th>Amount</Th>
                          <Th>Status</Th>
                          <Th>Options</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr borderBottom="1px" borderColor="gray.200">
                          <Td>1</Td>
                          <Td>John Doe</Td>
                          <Td>2024-11-12</Td>
                          <Td>$250.00</Td>
                          <Td>Completed</Td>
                          <Td>
                            <Button colorScheme="blue" size="sm">
                              View
                            </Button>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </div>
            </div>
          </div>

          <div>
            <h2>Table Component</h2>
          </div>
        </>
      );
    };

    export default PaymentPage;
