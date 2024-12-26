import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string, confirmPassword: string) => void;
}

const PasswordModal:React.FC<PasswordModalProps> = ({ isOpen, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // State to toggle visibility for each password field
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    onSave(currentPassword, newPassword, confirmPassword);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        {/* Current Password */}
        <label className="block mb-2">Current Password</label>
        <div className="relative mb-4">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border rounded-md w-full px-2 py-1"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* New Password */}
        <label className="block mb-2">New Password</label>
        <div className="relative mb-4">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded-md w-full px-2 py-1"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm New Password */}
        <label className="block mb-2">Confirm New Password</label>
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded-md w-full px-2 py-1"
            placeholder="Confirm new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-1 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default PasswordModal;
