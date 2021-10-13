import React, { ReactElement } from "react";
import { replaceMentionValues } from "./utils";

interface Props {
  message: string;
}

export default function TextMessage({ message }: Props): ReactElement {
  const messageTokens = React.useMemo(() => {
    let mess: React.ReactElement[] = [];
    let text = message || "";
    var startIndex = 0;
    replaceMentionValues(text, ({ id, name, trigger }: any) => {
      const mention = `${trigger}[${name}](${id})`;
      const index = text?.indexOf(mention);
      mess.push(<span>{text.substring(startIndex, index)}</span>);
      mess.push(<span style={{ color: "blue" }}>{name}</span>);
      text = text?.substr(index + mention.length) || "";
      return "";
    });
    if (text) {
      mess.push(<span>{text}</span>);
    }
    return mess;
  }, [message]);

  return <div style={{ display: "inline-block" }}>{messageTokens}</div>;
}
