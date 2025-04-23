// import { useEffect, useState } from 'react';
// import API from '../api';
// import { useNavigate } from 'react-router-dom';

// const Welcome = () => {
//   const [documents, setDocuments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDocs = async () => {
//       try {
//         const res = await API.get('/api/documents', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
        
//         setDocuments(res.data);
//       } catch (err) {
//         alert('Session expired. Please login again.');
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     };
//     fetchDocs();
//   }, [navigate]);

//   const handleNewFile = () => {
//     navigate('/whiteboard');
//   };

//   return (
//     <div>
//       <h1>Welcome to SmartInk!</h1>
//       {documents.length > 0 ? (
//         <div>
//           <h3>Your Files:</h3>
//           <ul>
//             {documents.map((doc, i) => (
//               <li key={i}>{doc.title || `Untitled Document ${i + 1}`}</li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>No saved documents. Start a new one!</p>
//       )}
//       <button onClick={handleNewFile}>+ New File</button>
//     </div>
//   );
// };

// export default Welcome;


import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const res = await API.get('/api/documents', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        setDocuments(res.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
        alert('Session expired or error occurred. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [navigate]);

  const handleNewFile = () => {
    navigate('/whiteboard');
  };
  
  const openDocument = (docId) => {
    navigate(`/whiteboard/${docId}`);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to SmartInk!</h1>
      
      <button onClick={handleNewFile} style={styles.newButton}>
        + Create New Document
      </button>
      
      {loading ? (
        <p>Loading your documents...</p>
      ) : documents.length > 0 ? (
        <div style={styles.documentsContainer}>
          <h3>Your Documents:</h3>
          <div style={styles.documentsList}>
            {documents.map((doc) => (
              <div key={doc._id} style={styles.documentCard} onClick={() => openDocument(doc._id)}>
                <h4 style={styles.documentTitle}>{doc.title || 'Untitled Document'}</h4>
                <p style={styles.documentDate}>Last updated: {formatDate(doc.updatedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>You don't have any saved documents yet.</p>
          <p>Create your first document to get started!</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  newButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '30px',
  },
  documentsContainer: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
  },
  documentsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  documentCard: {
    background: 'white',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  documentTitle: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#2c3e50',
  },
  documentDate: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d',
  },
  emptyState: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: '50px',
  }
};

export default Welcome;