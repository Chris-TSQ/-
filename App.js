import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import * as Speech from 'expo-speech';  // Importing expo-speech

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const Keyboard = ({ onKeyPress }) => {
  return (
    <View style={styles.keyboardContainer}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => onKeyPress(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <View style={styles.row}>
        <TouchableOpacity style={[styles.key, styles.specialKey]} onPress={() => onKeyPress(' ')} >
          <Text style={styles.keyText}>Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.key, styles.specialKey]} onPress={() => onKeyPress('backspace')} >
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
    Speech.speak("Listening for commands, say something.");  // Text-to-Speech feedback
  };

  const stopListening = () => {
    setIsListening(false);
    Speech.speak("Stopped listening.");
  };

  const handleVoiceCommand = (command) => {
    const lowerCaseCommand = command.toLowerCase();
    if (lowerCaseCommand === 'backspace') {
      setText((prevText) => prevText.slice(0, -1));
      Speech.speak('Backspace');
    } else if (lowerCaseCommand === 'space') {
      setText((prevText) => prevText + ' ');
      Speech.speak('Space');
    } else if (lowerCaseCommand === 'clear') {
      setText('');
      Speech.speak('Cleared');
    } else if (lowerCaseCommand === 'close') {
      Speech.speak('Closing the app.');
    } else if (/^[a-z]$/i.test(command)) {
      setText((prevText) => prevText + command);
      Speech.speak(`Added ${command}`);
    } else {
      Speech.speak('I didn’t understand that command.');
    }
  };

  const handleKeyPress = (key) => {
    if (key === 'backspace') {
      setText((prevText) => prevText.slice(0, -1));
    } else {
      setText((prevText) => prevText + key);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type here..."
      />
      <View style={styles.voiceControl}>
        <TouchableOpacity onPress={isListening ? stopListening : startListening} style={styles.listenButton}>
          <Text style={styles.listenButtonText}>{isListening ? 'Stop Listening' : 'Start Listening'}</Text>
        </TouchableOpacity>
      </View>
      <Keyboard onKeyPress={handleKeyPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  keyboardContainer: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  key: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 2,
  },
  specialKey: {
    flex: 2,
  },
  keyText: {
    fontSize: 18,
  },
  voiceControl: {
    marginBottom: 20,
    alignItems: 'center',
  },
  listenButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  listenButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
