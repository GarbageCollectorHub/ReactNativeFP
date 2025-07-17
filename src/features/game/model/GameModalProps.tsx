


export type GameModalProps = {
  visible: boolean;
  score: number;
  onRestart?: () => void;
  onClose: () => void;
  onContinue?: () => void;
};
