import { createWaterReports, getWaterReports } from '@/feature/waterReports/waterReportsSlice';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const DayDetailModal = ({ show, onClose, data, day, user, month, year }) => {
    const dispatch = useDispatch();


  const [scoreInput, setScoreInput] = useState('');
   const [dateInput, setDateInput] = useState(() => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // "YYYY-MM-DD"
});
  const [isEditing, setIsEditing] = useState(false);

   useEffect(() => {
    if (data.length > 0) {
      setScoreInput(data[0].score);
      setDateInput(new Date(data[0].createdAt).toISOString().split('T')[0]);
    } else {
      setScoreInput('');
      setDateInput(new Date().toISOString().split('T')[0]);
    }
  }, [data]);

  const handleSave = () => {
  if (scoreInput.trim() === '') return alert("Score is required");

  const payload = {
  customerId: user._id,
  waterScore: scoreInput.toString(), // Ensure it's a string
  date: new Date(dateInput).toISOString().split("T")[0], // Format to 'YYYY-MM-DD'
  // status: "false"
};


  dispatch(createWaterReports(payload))
    .unwrap()
    .then(() => {
      onClose();
      dispatch(getWaterReports({ month: month < 10 ? `0${month}` : month, year }));
    })
    .catch((err) => {
      console.error("Error creating water report:", err);
      alert("Failed to add water report. Please check the input.");
    });
};


  if (!show) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-2">
          Day {day} – {user?.display_name}
        </h2>

        {data?.length > 0 && (
          <ul className="space-y-2 mb-4">
            {data.map((entry, index) => (
              <li key={index} className="p-2 border rounded">
                <p><strong>Score:</strong> {entry.score}</p>
                {/* <p><strong>Status:</strong> {entry.status}</p> */}
               <p><strong>Date:</strong> {new Date(entry.createdAt).toISOString().split('T')[0]}</p>

              </li>
            ))}
          </ul>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {data.length > 0 ? 'Edit Score' : 'Add New Score'}
          </label>
          <input
            type="number"
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter score"
          />
            {!isEditing && (
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          )}
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;
