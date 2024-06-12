import React, { useState, useEffect } from 'react';
import { QrScanner } from 'react-qrcode-scanner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import { decryptMessage } from './cryptoUtils';

function App() {

  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  fetch('/private_key.pem')
    .then((r) => r.text())
    .then(text => {
      setPrivateKey(text);
    })

  return (
    <div className="App">
      <QrCodeScannerComponent privateKey={privateKey} />
    </div>
  );
}

export default App;

const QrCodeScannerComponent = ({ privateKey }) => {
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasMediaDevices, setHasMediaDevices] = useState(false);

  useEffect(() => {
    // Check if the navigator.mediaDevices object is available
    const mediaDevices = navigator.mediaDevices;
    setHasMediaDevices(!!mediaDevices);

    if (mediaDevices) {
      // Request camera permissions
      mediaDevices
        .getUserMedia({ audio: false, video: true })
        .then(function(mediaStream) {
          console.log('Camera permission granted');
        })
        .catch(function(err) {
          console.error('Error accessing camera:', err);
        });
    }
  }, []);

  function handleDecrypt(encryptedMessage) {
    const decrypted = decryptMessage(encryptedMessage, privateKey);
    return (decrypted);
  };

  function parseNameString(str) {
    const names = str.split(';');
    const parsedNames = names.map((name) => {
      const [first, last] = name.split('_');
      return [first, last];
    });
    return parsedNames;
  }

  const handleScan = (data) => {
    if (data) {
      const result = handleDecrypt(data);
      const parsedStrings = parseNameString(result);
      setQrData(parsedStrings);
      setModalOpen(true);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError(err);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setQrData(null);
  };

  return (
    <div style={{height:'100vh',width:'100vw'}}>
      {modalOpen ? 
      <div style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100vw', backgroundColor: 'rgba(255, 255, 255)', zIndex:1000}} /> : null
      }
      
      <QrScanner
        onScan={handleScan}
        onError={handleError}
        style={{ width: '100%', transform: 'scaleX(-1)' }} // Apply transform inline
        delay={1000}
      />
      {error && <p>Error: {error.message}</p>}

      {/* Bootstrap Modal */}
      <Modal show={modalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {qrData ? (
            <ul className="list-group">
              {qrData.map((name, index) => (
                <li key={index} className="list-group-item">
                  {`${name[0]} ${name[1]}`}
                </li>
              ))}
            </ul>
          ) : (
            <p>No data available.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};