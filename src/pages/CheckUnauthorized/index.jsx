import React from 'react';

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    fontFamily: 'Arial, sans-serif',
  },
  errorMessage: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '100px',
    color: '#ff6347',
    margin: 0,
  },
  subHeader: {
    fontSize: '24px',
    color: '#333',
    margin: '10px 0',
  },
  description: {
    fontSize: '16px',
    color: '#777',
    marginBottom: '20px',
  },
  homeLink: {
    fontSize: '18px',
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};
const CheckUnauthorized = () => {
  return (
    <div style={styles.container}>
      <div style={styles.errorMessage}>
        <h1 style={styles.header}>Unauthorized Test</h1>
        <p style={styles.subHeader}>This page is unauthorized for everyone for testing.</p>
      </div>
    </div>
  );
};



export default CheckUnauthorized;
