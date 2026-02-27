import { useLocalStorage } from './useLocalStorage';

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('atl-coffee-notes', {});

  const setNote = (id: string, text: string) => {
    setNotes((prev) => ({ ...prev, [id]: text }));
  };

  return { notes, setNote };
}
