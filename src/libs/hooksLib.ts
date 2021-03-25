import { ChangeEventHandler, useState } from 'react';

export function useFormFields<T extends object>(initialState: T): [T, ChangeEventHandler] {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    event => {
      const target = event.target as HTMLInputElement;
      setValues({
        ...fields,
        [target.id]: target.value
      });
    }
  ];
}
