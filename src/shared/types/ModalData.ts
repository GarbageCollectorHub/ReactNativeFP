  
  

type ModalData = {
    title? : string,
    message:  string,
    positiveButtonText?  : string,
    positiveButtonAction?: () => void,
    negativeButtonText?  : string,
    negativeButtonAction?: () => void,
    closeButtonAction?   : () => void,
  };

export default ModalData;