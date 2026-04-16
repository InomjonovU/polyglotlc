'use client';

import { useState, useCallback } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

/**
 * Format: +998 XX XXX XX XX
 * Only accepts Uzbekistan numbers starting with +998
 * Valid operator codes: 33,55,71,77,78,88,90,91,93,94,95,97,98,99
 */

const VALID_CODES = ['33','55','71','77','78','88','90','91','93','94','95','97','98','99'];

function formatPhone(raw: string): string {
  // Remove everything except digits
  const digits = raw.replace(/\D/g, '');

  // Ensure starts with 998
  let d = digits;
  if (d.startsWith('998')) {
    d = d.slice(3);
  } else if (d.startsWith('8') && d.length > 1) {
    d = d.slice(1);
  }

  // Limit to 9 digits after 998
  d = d.slice(0, 9);

  // Format: XX XXX XX XX
  let formatted = '+998';
  if (d.length > 0) formatted += ' ' + d.slice(0, 2);
  if (d.length > 2) formatted += ' ' + d.slice(2, 5);
  if (d.length > 5) formatted += ' ' + d.slice(5, 7);
  if (d.length > 7) formatted += ' ' + d.slice(7, 9);

  return formatted;
}

function getDigits(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.startsWith('998')) return d.slice(3);
  return d;
}

export function validatePhone(phone: string): string | null {
  const digits = getDigits(phone);
  if (digits.length === 0) return null; // empty is OK if not required
  if (digits.length < 9) return "Raqam to'liq emas (9 ta raqam kerak)";
  if (digits.length > 9) return "Raqam juda uzun";
  const code = digits.slice(0, 2);
  if (!VALID_CODES.includes(code)) return `Noto'g'ri operator kodi (${code})`;
  return null;
}

export function isPhoneComplete(phone: string): boolean {
  return getDigits(phone).length === 9;
}

export function getCleanPhone(phone: string): string {
  return '+998' + getDigits(phone);
}

export default function PhoneInput({ value, onChange, className = '', required = false }: PhoneInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Don't allow deleting the +998 prefix
    if (raw.length < 4) {
      onChange('+998 ');
      return;
    }

    const formatted = formatPhone(raw);
    onChange(formatted);

    // Clear error while typing
    if (error) {
      const err = validatePhone(formatted);
      if (!err) setError(null);
    }
  }, [onChange, error]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    const digits = getDigits(value);
    if (required && digits.length === 0) {
      setError('Telefon raqam kiriting');
    } else {
      const err = validatePhone(value);
      setError(err);
    }
  }, [value, required]);

  const handleFocus = useCallback(() => {
    if (!value || value.trim() === '' || value.trim() === '+998') {
      onChange('+998 ');
    }
  }, [value, onChange]);

  const showError = touched && error;

  return (
    <div>
      <input
        type="tel"
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="+998 90 123 45 67"
        className={`${className} ${showError ? '!border-red-400 !ring-red-100' : ''}`}
        maxLength={17}
        required={required}
      />
      {showError && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
