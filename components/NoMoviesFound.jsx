import React from 'react';
import { Animated, Easing } from 'react-native';

class NoMoviesFound extends React.Component {

  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  }

  handleAnimation = () => {
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue,
        {
          toValue: 1, 
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
          delay:100
        }
    ).start(() => this.handleAnimation());
  }

  componentDidMount(){
    this.handleAnimation()
  }

  render() {
    return (
      <>
        <Animated.Text
          style={{fontSize:100,textAlign:'center',justifyContent:'center',
            transform: [{
              translateX: this.animatedValue.interpolate({
                inputRange: [0, 0.25, 0.50, 0.75, 1],
                outputRange: [10, 20, 10, 20, 10]
              })
            }]
          }}>
          👀
        </Animated.Text>
      </>
    );
  }
}

export default NoMoviesFound;