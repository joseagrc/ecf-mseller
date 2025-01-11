import * as crypto from 'crypto'

export const calculateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  const message = username + clientId

  return crypto.createHmac('SHA256', clientSecret).update(message).digest('base64')
}
