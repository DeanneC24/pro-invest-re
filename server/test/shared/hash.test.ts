import argon2 from 'argon2'
import { hashString, verifyHash } from '../../src/shared/hash'

jest.mock('argon2')
const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>


describe('Hash Functions', () => {
  it('should hash a string', async () => {
    mockedArgon2.hash.mockResolvedValue('mockedHash')
    const hashedData = await hashString('testData')
    expect(hashedData).toBe('mockedHash')
  })

  it('should verify a correct hash', async () => {
    mockedArgon2.verify.mockResolvedValue(true)
    const isVerified = await verifyHash('testData', 'correctHash')
    expect(isVerified).toBe(true)
  })

  it('should fail to verify an incorrect hash', async () => {
    mockedArgon2.verify.mockResolvedValue(false)
    const isVerified = await verifyHash('testData', 'incorrectHash')
    expect(isVerified).toBe(false)
  })

  it('should handle hashing errors', async () => {
    mockedArgon2.hash.mockRejectedValue(new Error('Hashing failed'))
    await expect(hashString('testData')).rejects.toThrow('Error hashing supplied string')
  })

  it('should handle verification errors', async () => {
    mockedArgon2.verify.mockRejectedValue(new Error('Verification failed'))
    await expect(verifyHash('testData', 'correctHash')).rejects.toThrow('Error verifying hash: Error: Verification failed')
  })
})
