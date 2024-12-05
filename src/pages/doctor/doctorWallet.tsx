import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react"; // Importing the chip icon
import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import WithdrawalModal from "../../components/doctorSide/withdrawalComponent";
import axiosInstance from "@/utils/axiosClient";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore/store";

const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const DoctorWallet = () => {
  const doctorId = useSelector(
    (state: RootState) => state.doctor.doctorInfo?.docId
  );
  console.log("doctorId", doctorId);

  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNotes, setWithdrawNotes] = useState("");

  const [transactions, setTransactions] = useState([]);

  const [totalAmount, setTotalAmount] = useState();
  const [docName, setDoctorName] = useState("");
  const paymentHistory = [
    { id: 1, date: "2024-11-25", amount: "$120.50", status: "Completed" },
    { id: 2, date: "2024-11-24", amount: "$80.00", status: "Pending" },
    { id: 3, date: "2024-11-23", amount: "$200.75", status: "Completed" },
    { id: 4, date: "2024-11-22", amount: "$50.00", status: "Failed" },
  ];

  useEffect(() => {
    const doctorDetails = async () => {
      const response = await axiosInstance.get(
        `http://localhost:4444/doctor/profile?id=${doctorId}`
      );
      console.log("doctor response", response);
      setDoctorName(response.data.doctorProfile.personalInfo?.name);
    };
    doctorDetails();
  }, [doctorId]);

  useEffect(() => {
    const walletHistory = async () => {
      const response = await axiosInstance.get(
        `http://localhost:4444/doc-wallet/wallet-details?id=${doctorId}`
      );

      setTransactions(response.data.wallet.transactions);

      setTotalAmount(response.data.wallet.balance);
    };
    walletHistory();
  }, [doctorId]);

  const handleWithdrawal = async () => {
    try {
      setWithdrawModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWithdrawConfirm = (amount) => {
    // Add your withdrawal logic here
    console.log(`Withdrawing ${amount}`);
    // Typically, you'd call an API or update state here
  };

  return (
    <div className="bg-cyan-100 w-full h-full p-8">
      {/* Main Container */}
      <div className="flex bg-black w-full gap-6 rounded-md">
        {/* Left Section (Card) */}
        <div className="w-1/3 ml-4 mt-14 h-64 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6">
          {/* Card Content */}
          <div className="flex justify-between items-start">
            {/* Med-Tech Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/pictures/med-tech_logo.png"
                alt="Med-Tech Logo"
                className="w-10 h-10 rounded-full"
              />
              <h1 className="text-white font-semibold text-lg">Med-Tech</h1>
            </div>

            {/* Chip Icon */}
            <div className="flex items-center justify-center">
              <CreditCard className="text-white w-10 h-10" />
            </div>
          </div>

          {/* Card Details */}
          <div className="mt-10 text-white">
            <h2 className="text-xl font-bold tracking-widest">
              XXXX XXXX XXXX
            </h2>
            <p className="mt-4 text-sm">Dr {docName}</p>
            <p className="text-sm">05/25</p>
            {/* Card Amount */}
            <p className="mt-6 text-2xl font-bold">INR {totalAmount}</p>
          </div>

          {/* Withdraw Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleWithdrawal}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Withdraw
            </Button>
            <WithdrawalModal
              isOpen={withdrawModal}
              onClose={() => setWithdrawModal(false)}
              onConfirm={handleWithdrawConfirm}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-2/3 h-96 bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Placeholder for Header and Content */}
          <div className="mb-4">
            <h2 className="text-white text-lg font-bold">Content Header</h2>
          </div>
          <div className="flex justify-center items-center h-full">
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  radius={4}
                  barSize={40}
                />

                <Bar
                  dataKey="mobile"
                  fill="var(--color-mobile)"
                  radius={4}
                  barSize={40}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded w-full h-full  mt-28">
        <TableContainer id="table" className="border border-white shadow-lg">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>No.</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Amount</Th>
                {/* <Th>Total Amount</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((payment, ind) => (
                <Tr key={payment.id}>
                  <Td>{ind + 1}</Td>
                  <Td>
                    {new Date(payment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Td>
                  <Td>{payment.transactionType}</Td>
                  <Td>{payment.amount}</Td>
                  <Td>{}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default DoctorWallet;
