import React from "react";
import { IoIosCloseCircle } from "react-icons/io";

interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: string[];
  activeFilter: string | null;
  dropdownContent: { [key: string]: string[] };
  onSelectOption: (filter: string, option: string) => void; // Add this line
  onFilterSelect: (item: string) => void; // Add this line
}

const PopUp: React.FC<PopUpProps> = (props) => {
  return props.isOpen ? (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <IoIosCloseCircle
          onClick={props.onClose}
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200"
          size={24}
          aria-label="Close"
        />

        <div className="h-12 border-b border-gray-300 flex justify-center items-center mb-4">
          <h1 className="font-arial font-bold text-lg">Filter</h1>
        </div>

        <div className="flex">
          <div className="w-48 h-full bg-white border-gray-700 p-2 overflow-y-auto">
            {props.filterOptions.map((item, index) => (
              <button
                key={index}
                className="mt-2 border border-white hover:border-black rounded-md text-black"
                onClick={() => props.onFilterSelect(item)} // Call filter select
              >
                {item}
              </button>
            ))}
          </div>
          <div className="bg-green-800 w-full h-full p-4 text-white rounded-lg ml-4">
            <h3 className="font-bold">{props.activeFilter}</h3>
            {props.activeFilter && props.activeFilter !== null &&
          props.dropdownContent[props.activeFilter]?.map((option) => (
            <button
              key={option}
              onClick={() =>
                props.onSelectOption(props.activeFilter || '', option)
              }
              className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-green-700"
            >
              {option}
            </button>
          ))
        }
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default PopUp;
