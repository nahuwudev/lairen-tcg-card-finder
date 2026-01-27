import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import TextRecognition, { TextRecognitionResult } from '@react-native-ml-kit/text-recognition';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraType] = useState<CameraType>('back');
  const cameraRef = useRef<any>(null);
  const processingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Procesar frames de la cámara cada 2 segundos
    if (permission?.granted) {
      processingInterval.current = setInterval(() => {
        captureAndRecognize();
      }, 2000);
    }

    return () => {
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    };
  }, [permission?.granted]);

  const captureAndRecognize = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);

      // Tomar foto de la cámara
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
      });

      // Realizar OCR
      const result: TextRecognitionResult = await TextRecognition.recognize(photo.uri);

      if (result.text) {
        setRecognizedText(result.text);
      }
    } catch (error) {
      console.error('Error en OCR:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos tu permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Vista de cámara */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <Text style={styles.scanText}>Apunta la cámara al texto</Text>
            </View>
          </View>
        </CameraView>
      </View>

      {/* Panel de resultados */}
      <View style={styles.resultContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Texto Reconocido</Text>
          {isProcessing && (
            <ActivityIndicator size="small" color="#007AFF" />
          )}
        </View>

        <ScrollView style={styles.scrollView}>
          {recognizedText ? (
            <Text style={styles.resultText}>{recognizedText}</Text>
          ) : (
            <Text style={styles.placeholderText}>
              El texto aparecerá aquí automáticamente...
            </Text>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setRecognizedText('')}
        >
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 2,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: '80%',
    height: '40%',
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
