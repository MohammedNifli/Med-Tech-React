import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Select,
} from "@chakra-ui/react";
import { Trash2, Edit } from "lucide-react";
import axiosInstance from "../../utils/axiosClient";
import Time from "react-datepicker/dist/time";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface TimeSlot {
  _id: string;
  date: string;
  time: string;
  status: string;
  doctorId: string;
  mode:string
}

interface SlotType {
  date: string; // Format: "DD/MM/YYYY"
  startTime: string; // Example: "10:30 AM"
}

const Slot: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [existingSlots, setExistingSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //edit slot state
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editSlot, setEditSlot] = useState<object[]>([]);
  const [oldDate, setOldDate] = useState("");
  const [oldTime, setOldTime] = useState("");
  const [mode, setMode] = useState("online");

  const doctorAuth = useSelector((state: RootState) => state.doctor);
  const docId = doctorAuth.doctorInfo?.docId as string;

  // Fetch existing slots
  const fetchExistingSlots = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/doctor/slots?id=${docId}`, {
        withCredentials: true,
      });
      console.log("repsonse from modal fetching doctor slots", response);
      setExistingSlots(response.data?.fetchedSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch existing slots");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateToISO = (dateString: string): string => {
    const [day, month, year] = dateString.split("/").map(Number);

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const handleDeleteSlot = async (date: string, time: string) => {
    try {
      const formattedDate = formatDateToISO(date);

      console.log("Formatted Date:", formattedDate); // Should log in YYYY-MM-DD format
      console.log("Time:", time); // Should log time as HH:MM

      await axios.delete(`http://localhost:4444/doctor/slot`, {
        withCredentials: true,
        data: {
          docId,
          date: formattedDate,
          time,
        },
      });

      toast.success("Slot deleted successfully");
      fetchExistingSlots();
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast.error("Failed to delete slot");
    }
  };

  const formatToISO = (date: string) => {
    return new Date(date).toISOString();
  };

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addTimeSlot = () => {
    if (startTime) {
      const formattedSlot = `${startTime} ${startPeriod}`;
      if (!timeSlots.includes(formattedSlot)) {
        setTimeSlots((prev) => [...prev, formattedSlot].sort());
        setStartTime("");
        setStartPeriod("AM");
        toast.success("Time slot added successfully!");
      } else {
        toast.error("This time slot already exists!");
      }
    } else {
      toast.error("Please enter a valid time!");
    }
  };

  const removeTimeSlot = (slotToRemove: string) => {
    setTimeSlots((prev) => prev.filter((slot) => slot !== slotToRemove));
    toast.success("Time slot removed successfully!");
  };

  const handleSubmit = async () => {
    if (
      !startDate ||
      !endDate ||
      selectedDays.length === 0 ||
      timeSlots.length === 0
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const payload = {
      startDate: formatToISO(startDate),
      endDate: formatToISO(endDate),
      timeSlots: timeSlots,
      doctorId: docId,
      availableDays: selectedDays,
      consultationMode:mode,
    };

    try {
      const response = await axios.post(
        "http://localhost:4444/doctor/slot",

        payload,
        { withCredentials: true }
      );
      console.log("Slots created:", response.data);
      toast.success("Time slots created successfully!");

      setStartDate("");
      setEndDate("");
      setSelectedDays([]);
      setTimeSlots([]);
    } catch (error) {
      console.error("Error creating slots:", error);
      toast.error("Failed to create time slots. Please try again.");
    }
  };

  //edit modal

  const handleEditSlot = (slot: {
    date: string;
    startTime: string;
    status: string;
  }) => {
    setEditModalOpen(true);

    // Destructure the slot details
    const { date: dateString, startTime } = slot;

    // Convert date and time to UTC ISO format
    const oldDateTime = convertToISOFormat(dateString, startTime);
    setOldDate(oldDateTime);
    console.log("slotDateTime in UTC:", oldDateTime);

    // Validation: Ensure date and time are defined
    if (!dateString || !startTime) {
      console.error("Invalid slot data:", slot);
      return;
    }

    // Parse the date string (format: DD/MM/YYYY)
    const [day, month, year] = dateString.split("/").map(Number);
    if (!day || !month || !year) {
      console.error("Invalid date format:", dateString);
      return;
    }

    const date = new Date(year, month - 1, day); // Month is 0-indexed
    if (isNaN(date.getTime())) {
      console.error("Failed to parse date:", dateString);
      return;
    }

    // Get day of the week
    const dayNumber = date.getDay();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const slotDay = dayNames[dayNumber];

    // Format date as YYYY-MM-DD
    const formattedDate = date.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
    console.log("Formatted Date:", formattedDate);

    // Convert time to 12-hour format (optional)
    const [time, period] = convertTo12HourFormat(startTime);

    // Prepare slot data
    const Slot = {
      date: formattedDate,
      time: time,
      period: period,
      day: slotDay,
    };

    setEditSlot([Slot]); // Since Chakra modal edits one slot at a time
  };

  // Helper: Convert 24-hour time to 12-hour format
  const convertTo12HourFormat = (time24: string): [string, string] => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return [
      `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
      period,
    ];
  };

  // Function to convert date and time to UTC ISO format
  function convertToISOFormat(ddmmyyyy: string, time = "00:00"): string {
    // Split the date string into day, month, year
    const [day, month, year] = ddmmyyyy.split("/").map(Number);

    // Split time into hours and minutes
    const [hours, minutes] = time.split(":").map(Number);

    // Create a date object in the local timezone
    const localDate = new Date(year, month - 1, day, hours, minutes, 0);

    // Convert the local date to UTC by creating a new Date using Date.UTC
    const utcDate = new Date(
      Date.UTC(
        localDate.getUTCFullYear(),
        localDate.getUTCMonth(),
        localDate.getUTCDate(),
        localDate.getUTCHours(),
        localDate.getUTCMinutes(),
        localDate.getUTCSeconds()
      )
    );

    // Return the UTC date in ISO 8601 format
    return utcDate.toISOString();
  }

  const handleUpdateSlot = async (slot) => {
    console.log("slot", slot);

    // Step 1: Ensure 'slot.date' and 'slot.time' are defined
    if (!slot[0].date || !slot[0].time) {
      console.error("Invalid slot data: Missing date or time.");
      return;
    }

    // Step 2: Extract and parse the date and time from the slot
    const [year, month, day] = slot[0].date.split("-").map(Number);
    const [hours, minutes] = slot[0].time.split(":").map(Number);

    // Step 3: Create the local time using the provided date and time
    const localDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

    // Step 4: Convert the local time to UTC time
    const startDateUTC = new Date(localDateTime.toISOString()); // Automatically converts to UTC

    // Step 5: Create the end time (30 minutes after the start time)
    const endDateUTC = new Date(startDateUTC);
    endDateUTC.setMinutes(startDateUTC.getMinutes() + 30);

    // Step 6: Prepare the slot object to send to the backend
    const sendSlot = {
      doctorId: docId,
      oldDateAndTime: oldDate,
      day: slot[0].day, // Assuming this is already valid
      startDateTime: startDateUTC.toISOString(), // In UTC format
      endDateTime: endDateUTC.toISOString(), // In UTC format
    };

    try {
      // Step 7: Send the slot data to the backend
      const response = await axios.post(
        "http://localhost:4444/doctor/edit-slot",
        { sendSlot },
        { withCredentials: true }
      );
      console.log("Response from edit slot:", response);
    } catch (error) {
      console.error("Error updating slot:", error);
    }

    // Logging for debugging
    console.log("Formatted Slot:", sendSlot);
    console.log("Old date:", oldDate);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Schedule Time Slots
        </h1>
        <button
          onClick={() => {
            setIsManageModalOpen(true);
            fetchExistingSlots();
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Manage Time Slots
        </button>
      </div>

      <div className="space-y-6">
        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Mode
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setMode("online")}
              className={`px-4 py-2 rounded-md ${
                mode === "online"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-indigo-500 hover:text-white transition-colors`}
            >
              Online
            </button>
            <button
              onClick={() => setMode("offline")}
              className={`px-4 py-2 rounded-md ${
                mode === "offline"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-indigo-500 hover:text-white transition-colors`}
            >
              Offline
            </button>
          </div>
        </div>

        {/* Day Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-md ${
                  selectedDays.includes(day)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-indigo-500 hover:text-white transition-colors`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Time Slots
          </label>
          <div className="flex gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <select
              value={startPeriod}
              onChange={(e) => setStartPeriod(e.target.value)}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            <button
              onClick={addTimeSlot}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Slot
            </button>
          </div>

          {/* Display Selected Time Slots */}
          <div className="mt-4 flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{slot}</span>
                <button
                  onClick={() => removeTimeSlot(slot)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Time Slots
          </button>
        </div>
      </div>

      {/* Manage Slots Modal */}
      <Modal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="4xl" maxH="80vh">
          <ModalHeader>Manage Time Slots</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="mt-4">
                <div className="overflow-x-auto max-h-80">
                  {" "}
                  {/* Limit the height */}
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10">
                          Date
                        </th>
                        <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10">
                          Time
                        </th>
                        <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10">
                          Status
                        </th>
                        <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {existingSlots.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No time slots found
                          </td>
                        </tr>
                      ) : (
                        existingSlots.map((slot) => (
                          <tr key={slot._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatDate(slot.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {slot.startTime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    slot.status === "available"
                      ? "bg-green-100 text-green-800"
                      : slot.status === "booked"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                              >
                                {slot.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap space-x-4">
                              <button
                                onClick={() =>
                                  handleDeleteSlot(slot?.date, slot?.startTime)
                                }
                                disabled={slot.status === "booked"}
                                className={`text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={
                                  slot.status === "booked"
                                    ? "Cannot delete booked slots"
                                    : "Delete slot"
                                }
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>

                              <button onClick={() => handleEditSlot(slot)}>
                                <Edit className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* {Edit Modal} */}

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Time Slot</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              {/* Date Input */}
              <FormControl id="startDate" isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={editSlot[0]?.date || ""}
                  onChange={(e) =>
                    setEditSlot((prev) =>
                      prev.map((slot, i) =>
                        i === 0 ? { ...slot, date: e.target.value } : slot
                      )
                    )
                  }
                />
              </FormControl>

              {/* Day Selection */}

              {/* Time and AM/PM Selection */}
              <FormControl id="startTime" mt={4} isRequired>
                <FormLabel>Time</FormLabel>
                <HStack>
                  {/* Time Input */}
                  <Input
                    type="time"
                    value={editSlot[0]?.time || ""}
                    onChange={(e) =>
                      setEditSlot((prev) =>
                        prev.map((slot, i) =>
                          i === 0 ? { ...slot, time: e.target.value } : slot
                        )
                      )
                    }
                  />

                  {/* AM/PM Selection */}
                  <Select
                    value={editSlot[0]?.period || "AM"}
                    onChange={(e) =>
                      setEditSlot((prev) =>
                        prev.map((slot, i) =>
                          i === 0 ? { ...slot, period: e.target.value } : slot
                        )
                      )
                    }
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </Select>
                </HStack>
              </FormControl>

              {/* Day Display (Read-Only) */}
              <FormControl id="day" mt={4} isRequired>
                <FormLabel>Day</FormLabel>
                <Select
                  value={editSlot[0]?.day || ""}
                  onChange={(e) =>
                    setEditSlot((prev) =>
                      prev.map((slot, i) =>
                        i === 0 ? { ...slot, day: e.target.value } : slot
                      )
                    )
                  }
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </Select>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => setEditModalOpen(false)}
              variant="outline"
              mr={3}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                // Add save logic here if needed
                handleUpdateSlot(editSlot);
                setEditModalOpen(false);
              }}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Slot;
