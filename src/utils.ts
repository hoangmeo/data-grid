const mentionRegEx =
  /(?<original>(?<trigger>.)\[(?<name>[^[]*)]\((?<id>[^[]*)\))/gi;
declare type MentionData = {
  original: string;
  trigger: string;
  name: string;
  id: string;
};
export const replaceMentionValues = (
  value: string,
  replacer: (mention: MentionData) => string
) =>
  value.replace(mentionRegEx, (fullMatch, original, trigger, name, id) =>
    replacer({
      original,
      trigger,
      name,
      id,
    })
  );
