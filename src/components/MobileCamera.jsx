import React, { useState, useRef, useCallback } from 'react';
import { FaCameraRetro, FaTimes, FaSync, FaCheck } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function MobileCamera({ isOpen, onClose, onCapture }) {
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        const photoUrl = URL.createObjectURL(blob);
        setCapturedPhoto(photoUrl);
      },
      'image/jpeg',
      0.9
    );
  }, []);

  // Switch camera
  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    stopCamera();
    setTimeout(startCamera, 100);
  }, [startCamera, stopCamera]);

  // Use photo
  const usePhoto = useCallback(() => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      setCapturedPhoto(null);
      stopCamera();
      onClose();
    }
  }, [capturedPhoto, onCapture, onClose, stopCamera]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    if (!stream) {
      startCamera();
    }
  }, [stream, startCamera]);

  // Start camera when component opens
  React.useEffect(() => {
    if (isOpen && !stream && !capturedPhoto) {
      startCamera();
    } else if (!isOpen) {
      stopCamera();
      setCapturedPhoto(null);
    }
  }, [isOpen, stream, capturedPhoto, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="camera-fullscreen flex flex-col">
      {/* Header */}
      <div className="safe-area-top flex justify-between items-center p-4 bg-black bg-opacity-50 z-10">
        <button
          onClick={onClose}
          className="mobile-btn haptic-medium bg-black bg-opacity-50 text-white p-3 rounded-full"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-white font-diamond text-lg">
          <HiSparkles className="inline mr-2" />
          Photo2Profit
        </div>

        {stream && (
          <button
            onClick={switchCamera}
            className="mobile-btn haptic-medium bg-black bg-opacity-50 text-white p-3 rounded-full"
          >
            <FaSync size={20} />
          </button>
        )}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="mobile-loading">
              <div className="mobile-spinner"></div>
              <div className="text-white mt-4">Starting camera...</div>
            </div>
          </div>
        )}

        {capturedPhoto ? (
          <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}

        {/* Camera overlay UI */}
        {!isLoading && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Focus grid */}
            <div className="absolute inset-4 border border-white border-opacity-30">
              <div className="absolute top-1/3 left-0 right-0 border-t border-white border-opacity-20"></div>
              <div className="absolute top-2/3 left-0 right-0 border-t border-white border-opacity-20"></div>
              <div className="absolute left-1/3 top-0 bottom-0 border-l border-white border-opacity-20"></div>
              <div className="absolute left-2/3 top-0 bottom-0 border-l border-white border-opacity-20"></div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="safe-area-bottom bg-black bg-opacity-50 p-6">
        {capturedPhoto ? (
          <div className="flex justify-center space-x-8">
            <button
              onClick={retakePhoto}
              className="mobile-btn haptic-medium bg-white bg-opacity-20 text-white px-6 py-3 rounded-full flex items-center"
            >
              <FaSync className="mr-2" />
              Retake
            </button>

            <button
              onClick={usePhoto}
              className="mobile-btn haptic-heavy bg-gradient-to-r from-rosegold to-rosegold-light text-white px-8 py-3 rounded-full flex items-center"
            >
              <FaCheck className="mr-2" />
              Use Photo
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={capturePhoto}
              disabled={!stream || isLoading}
              className="mobile-btn haptic-heavy bg-white p-6 rounded-full shadow-lg disabled:opacity-50"
            >
              <FaCameraRetro size={32} className="text-rosegold" />
            </button>
          </div>
        )}
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
