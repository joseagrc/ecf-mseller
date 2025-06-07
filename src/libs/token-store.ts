const passwordResetTokens = new Map<string, string>()
const verificationTokens = new Map<string, string>()

export function setPasswordResetToken(email: string, token: string) {
  passwordResetTokens.set(email, token)
}

export function getPasswordResetToken(email: string) {
  return passwordResetTokens.get(email)
}

export function removePasswordResetToken(email: string) {
  passwordResetTokens.delete(email)
}

export function setVerificationToken(email: string, token: string) {
  verificationTokens.set(email, token)
}

export function getVerificationToken(email: string) {
  return verificationTokens.get(email)
}

export function removeVerificationToken(email: string) {
  verificationTokens.delete(email)
}
