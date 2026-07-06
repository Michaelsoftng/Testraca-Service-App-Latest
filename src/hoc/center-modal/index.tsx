import React from 'react';
import {Dimensions} from 'react-native';
import ReactNativeModal from 'react-native-modal';

interface Props {
  children: React.ReactNode;
  isModalVisible: boolean;
  toggleModal: () => void;
}

function PopUpModal({children, isModalVisible, toggleModal}: Props) {
  const deviceHeight = Dimensions.get('screen').height;
  return (
    <React.Fragment>
      <ReactNativeModal
        statusBarTranslucent={true}
        backdropTransitionOutTiming={0}
        isVisible={isModalVisible}
        deviceHeight={deviceHeight}
        onBackdropPress={toggleModal}
        onSwipeComplete={toggleModal}
        style={{justifyContent: 'center', alignItems: 'center', margin: 0}}>
        {children}
      </ReactNativeModal>
    </React.Fragment>
  );
}

export default PopUpModal;
