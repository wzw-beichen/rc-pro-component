import BasicText from "./BasicText";
import CopyText from "./CopyText";
import MiddleEllipsisText from "./MiddleEllipsisText";

type BasicTextType = typeof BasicText;

type TextComponent = BasicTextType & {
  Copy: typeof CopyText;
  MiddleEllipsis: typeof MiddleEllipsisText;
};

const Text = BasicText as TextComponent;

Text.Copy = CopyText;
Text.MiddleEllipsis = MiddleEllipsisText;

export { Text, CopyText, MiddleEllipsisText };
