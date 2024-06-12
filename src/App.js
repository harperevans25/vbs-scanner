import React, { useState, useEffect } from 'react';
import { QrScanner } from 'react-qrcode-scanner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import { decryptMessage } from './cryptoUtils';

function App() {

  const [privateKey, setPrivateKey] = useState(`-----BEGIN PRIVATE KEY-----
MIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQDoGE8NLD99zS98
twWUPXDgGeRpLrWHAoczTEOquwWQag5gtsnFCLXaCA0agEVeJz7N0NngGZLbC4NJ
E1Wyj6WAPD0byfrA+m2FxfyG0+q2agcoiDOeoQeO0gZsivGCcQFwTQIPCpz72oSj
fWUiKyaMNe7GbNrf6xS3/RIswmKIN0X4Dn64MmtELDq3VJ6hE4wYawZdsoq9NyMQ
AiQl0r1zBJ6pW7bAB5+1OVKStpPlF6GTQTf0qfGaD2o5WpKzWBoT3W46kX2cAI08
BfWMUbIiE9P2uy3zqA6AJJDFFGnURpX87YCP+xJrznSbB2nxTm+pY9/d+3NIBYPV
q8D7jz0JAgMBAAECggEBAIlQyIRsp2vQl8XbqstXxo5wAzlPz0p/bmolNuuuFs6o
ULVbr+iJDL5ggRAqz9+yrG+snxr9RmueViBH9i3c2vgRq73jNB40i9PXnV5PxtAB
zxZl7tRtRUF0dSSG1/hqz4UXqp4nk1VWpZ7ss4cRrI7L4ec3xA8y0GFCsxwULaOU
n6viUmGDugXtgpqf+OPwBCHSHeAYuq5sPukiI1gfySnjEbq3OKaZqQ4xuYeCy//B
onsMVtsm7eAsqQ0Wc+M+IeYPTc7pRbXCp0sjBvYMRc82K8u4A/FXQGfZXoJmJOWz
fl+/KI3OIvqjBeEbCb+EUIn7ZgegzF/Lo7thhZSBL9kCgYEA+PSQ7KsZPUFNY5wg
YuOIrFkNilkTgQdu1PzHAHbgIKojNXFLjsYUJ+eIwIvJdrmJe1yTB45xBjw9b+vy
pyoC34YJNWERanrRMbUkL0AbvdMU7J3TLByKETBVu596F4lXCBvvB+02OsYdj1f2
UxpXc6hUwsu4PvxMMayGStFuoFMCgYEA7qmbIlccMYakvGfJooNsKMwRBJR00TnS
1WNWT8JPw2XASGt9PpxGURMxuke02hLCW/PLB2AmS0B9Lp8DsJRRsg416Vew0o08
onAJH8CrFMhLYPoLds/fgaRpf0cw+pMi+REP88o4VsOWI64Lneg8dD6RKrR9hC4y
s68gW7O98bMCgYEA6JU7zA+xPbwDe/sBesGOD04HS2gaw6HZFpytoi5tB7dLu4ME
DvfZHsq9xP0Tk5qU6a48IoQd7bBbyXNKuIeUNZV4hukPp0XkqKbNjmM7R6WrV7++
6OgkyRg6EFZWbyS9LXNDZklkL5alSSTpmQv0BbaOsYo3sIhu+r1unPl6e8cCgYEA
nKF9Kd1nqG1IQkoPP/PmkSPUa2APBp1fbCJErBXHiWKG/kBlMykW0PC66xlSbOhw
3C406gNFPo/1WBqOLl44+5Vt9lVRu+1rhOPoaQlmfj4xklSoH3KvqgLAJgMP9vOH
uVRkVsg5j1/Pcl0wTJL00gmZ9h/8XDqBlgFySBy/pRcCgYEAvU6nfbHOIy4lgagI
L68yJf03yGYS2lJKt1EVJ3tSqjVsX+1wR/RC8SKHPOHTKZGk2jiBug34ofYGzMqP
Rf12F7PNg9IS2CRQyucZ2XnD4CqLlXoWR8sHjNSpB2wcdQ719bAWnWokKt8Tteyt
RDLT2B9DNmutwvP3cP7yxCOwrGo=
-----END PRIVATE KEY-----`);
  const [publicKey, setPublicKey] = useState(null);

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