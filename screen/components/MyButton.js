import React, {Component} from 'react'
import {Button, ActivityIndicator} from 'react-native-paper'
import {View, Text, StyleSheet} from 'react-native'

class MyButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  handleClick = () => {
    const {onClick} = this.props
    if (onClick) {
      this.setState({loading: true})
      // Call the custom onClick function
      onClick().finally(() => {
        // Set loading to false after onClick finishes
        this.setState({loading: false})
      })
    }
  }

  render () {
    const {loading} = this.state
    const {buttonText, style, ...buttonProps} = this.props
    return (
      <View style={styles.container}>
        <Button
          mode='contained'
          onPress={this.handleClick}
          disabled={loading}
          loading={loading}
          contentStyle={[styles.buttonContent, style]} // Merge style props with the default button content styles
          {...buttonProps} // Spread all other props to the Button component
        >
          <Text>{buttonText}</Text>
          {/* {loading ? (
            <ActivityIndicator animating={true} color='white' />
          ) : (
            <Text>{buttonText}</Text>
          )} */}
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '50%', // Ensure the button takes full width
    // alignItems: 'center', // Center the button horizontally
  },
  buttonContent: {
    width: '100%', // Ensure the button content takes full width
  },
})

export default MyButton
