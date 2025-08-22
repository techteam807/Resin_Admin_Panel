import { createWaterReports, deleteWaterReport } from '@/feature/waterReports/waterReportsSlice';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const DayDetailModal = ({ show, onClose, data, day, user, month, year }) => {
  const dispatch = useDispatch();
  const { deleting, isLoading, deleteSuccess, deleteError } = useSelector(state => state.waterReport);
  const [scoreInput, setScoreInput] = useState('');
  const [dateInput, setDateInput] = useState(() => {
    const selectedDate = new Date(year, month - 1, day);
    return selectedDate.toISOString().split('T')[0];
  });

  useEffect(() => {
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setDateInput(formattedDate);
    if (data.length > 0) {
      setScoreInput(data[0].score);
    } else {
      setScoreInput('');
    }
  }, [data, day, month, year]);

  const handleSave = () => {
    if (scoreInput.trim() === '') return alert("Score is required");

    const payload = {
      customerId: user._id,
      waterScore: scoreInput.toString(),
      date: dateInput,
    };

    dispatch(createWaterReports(payload))
      .unwrap()
      .then(() => {
        setScoreInput('');
        onClose();
      })
      .catch((err) => {
        console.error("Error creating water report:", err);
      });
  };


  const handleDelete = () => {
    if (data.length === 0) return alert('No entry to delete');

    const logId = data[0].id;

    dispatch(deleteWaterReport(logId))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error('Error deleting water report:', err);
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
          Day {day} – {user?.first_name} {user?.last_name}
        </h2>

        {data?.length > 0 && (
          <ul className="space-y-2 mb-4">
            {data.map((entry, index) => (
              <li key={index} className="p-2 border rounded">
                <p><strong>Score:</strong> {entry.score}</p>
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
          <input
            type="date"
            value={dateInput}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <div className='flex gap-5'>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            {data.length > 0 && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;
