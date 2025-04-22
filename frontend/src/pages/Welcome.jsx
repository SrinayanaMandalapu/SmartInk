import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await API.get('/api/documents', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        setDocuments(res.data);
      } catch (err) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchDocs();
  }, [navigate]);

  const handleNewFile = () => {
    navigate('/whiteboard');
  };

  return (
    <div>
      <h1>Welcome to SmartInk!</h1>
      {documents.length > 0 ? (
        <div>
          <h3>Your Files:</h3>
          <ul>
            {documents.map((doc, i) => (
              <li key={i}>{doc.title || `Untitled Document ${i + 1}`}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No saved documents. Start a new one!</p>
      )}
      <button onClick={handleNewFile}>+ New File</button>
    </div>
  );
};

export default Welcome;
