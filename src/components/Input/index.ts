import Input from "./TrimmedInput";
import TrimmedTextArea from "./TrimmedTextArea";
import TrimmedInputWithSelect from "./TrimmedInputWithSelect";

type InputType = typeof Input;

type InputComponent = InputType & {
  TextArea: typeof TrimmedTextArea;
  WithSelect: typeof TrimmedInputWithSelect;
};

const TrimmedInput = Input as InputComponent;

TrimmedInput.TextArea = TrimmedTextArea;
TrimmedInput.WithSelect = TrimmedInputWithSelect;

export { TrimmedInput, TrimmedTextArea, TrimmedInputWithSelect };
