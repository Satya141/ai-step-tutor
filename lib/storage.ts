export const loadHistory = (subject: string) => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(`chat_${subject}`);
  return data ? JSON.parse(data) : [];
};

export const saveHistory = (subject: string, messages: any[]) => {
  localStorage.setItem(`chat_${subject}`, JSON.stringify(messages));
};
