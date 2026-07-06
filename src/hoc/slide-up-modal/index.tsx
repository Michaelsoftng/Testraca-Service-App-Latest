import React from 'react';
import {Dimensions} from 'react-native';
import ReactNativeModal, {Direction} from 'react-native-modal';

interface Props {
  children: React.ReactNode;
  isModalVisible: boolean;
  toggleModal: () => void;
  swipeDirection?: Direction | Direction[] | undefined;
}

function SlideUpModal({
  children,
  isModalVisible,
  toggleModal,
  swipeDirection = ['down'],
}: Props) {
  const deviceHeight = Dimensions.get('screen').height;

  return (
    <React.Fragment>
      <ReactNativeModal
        // onRequestClose={() => toggleModal()}
        onBackButtonPress={() => toggleModal()}
        statusBarTranslucent={true}
        backdropTransitionOutTiming={0}
        isVisible={isModalVisible}
        deviceHeight={deviceHeight}
        onBackdropPress={toggleModal}
        onSwipeComplete={toggleModal}
        swipeDirection={swipeDirection}
        hideModalContentWhileAnimating={false}
        animationInTiming={600} // Adjust the duration as needed
        animationOutTiming={600}
        style={{justifyContent: 'flex-end', margin: 0}}>
        {children}
      </ReactNativeModal>
    </React.Fragment>
  );
}

export default SlideUpModal;
