import { useRef, type KeyboardEvent } from 'react';

interface CodeInputProps {
  onComplete: (code: string) => void;
}

export default function CodeInput({ onComplete }: CodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function handleInput(idx: number) {
    const el = inputsRef.current[idx];
    if (!el) return;
    el.value = el.value.replace(/[^0-9]/g, '');
    if (el.value && idx < 2) {
      inputsRef.current[idx + 1]?.focus();
    }
    checkComplete();
  }

  function handleKeydown(e: KeyboardEvent, idx: number) {
    if (e.key === 'Backspace' && !inputsRef.current[idx]?.value && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === 'Enter') {
      checkComplete();
    }
  }

  function checkComplete() {
    const code = inputsRef.current.map(i => i?.value || '').join('');
    if (code.length === 3) {
      onComplete(code);
    }
  }

  function clear() {
    inputsRef.current.forEach(i => { if (i) i.value = ''; });
    inputsRef.current[0]?.focus();
  }

  return { clear, inputsRef, handleInput, handleKeydown };
}

export function CodeInputUI({
  inputsRef,
  onInput,
  onKeydown,
}: {
  inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onInput: (idx: number) => void;
  onKeydown: (e: KeyboardEvent, idx: number) => void;
}) {
  return (
    <div className="flex gap-4 justify-center mb-8">
      {[0, 1, 2].map(i => (
        <input
          key={i}
          ref={el => { inputsRef.current[i] = el; }}
          type="text"
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]"
          onInput={() => onInput(i)}
          onKeyDown={e => onKeydown(e, i)}
          className="w-[72px] h-[86px] bg-star-cyan/[0.03] border-2 border-star-border rounded-[0.85rem]
            text-center font-orbitron text-[2.4rem] font-bold text-star-gold
            outline-none transition-all duration-300
            focus:border-star-gold focus:shadow-[0_0_25px_rgba(255,232,31,0.2),inset_0_0_12px_rgba(255,232,31,0.05)]
            caret-star-gold
            max-sm:w-[60px] max-sm:h-[72px] max-sm:text-[1.8rem]"
        />
      ))}
    </div>
  );
}
