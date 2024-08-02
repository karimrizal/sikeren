import React, { useState } from 'react';
import { View, Button, Platform, Touchable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';

const DateTimePickerInput = ({ value, onChange, ...props }) => {
  const [date, setDate] = useState(new Date());
  // const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showTime, setShowTime] = useState(false);

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setShowPicker(Platform.OS === 'ios');
  //   setDate(currentDate);
  // };

  const handleOnChange = (event, selectedDate) => {
    // setShowPicker(Platform.OS === 'ios');
    setShowPicker(false);
    setDate(selectedDate);
    // onChange(selectedDate);
    setShowTime(true);
  };

  const handleOnTimeChange = (event, selectedTime) => {
    // setShowTime(Platform.OS === 'ios');
    setShowTime(false);
    setDate(selectedTime);
    // onChange(selectedDate);
    // console.log("wayan");
    // console.log(date);
    // console.log(selectedTime);
    onChange(selectedTime);
  };

  const showDateTimePicker = () => {
    setShowPicker(true);
  };

  return (
    <View>
      {/* <Button onPress={showDateTimePicker} title="Select Date" /> */}
      <TouchableOpacity onPress={showDateTimePicker}>
        <TextInput
          value={date.toLocaleDateString()+" "+date.toLocaleTimeString()}
          // value={date}
          editable={false}
          {...props}
        />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleOnChange}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={handleOnTimeChange}
        />
      )}
    </View>
  );
};

export default DateTimePickerInput;
