export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return {valid: false, error: 'O nome deve ter pelo menos 2 caracteres.'};
  }
  return {valid: true};
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basic.test(trimmed)) {
    return {valid: false, error: 'Informe um e-mail válido.'};
  }
  return {valid: true};
}

export function validateBio(bio: string): ValidationResult {
  if (bio.length > 200) {
    return {
      valid: false,
      error: 'A bio pode ter no máximo 200 caracteres.',
    };
  }
  return {valid: true};
}
