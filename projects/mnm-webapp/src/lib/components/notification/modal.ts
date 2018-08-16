export interface Modal {
  id: string;
  title: string;
  message: string;
  callback: any;
  buttons?: string[];
  promptPlaceholder?: string;
  type?: string;
  promptText?: string; // for ng model (not the message in the modal)
}
