import { describe, it, expect } from 'vitest'
import { fetchCandidates, patchCandidateStatus } from '../src/services/api'
import { candidatesData } from '../src/services/mockData'

describe('api service', () => {
  it('fetchCandidates resolves with the mock candidate list', async () => {
    const result = await fetchCandidates()
    expect(result).toEqual(candidatesData)
  })

  it('patchCandidateStatus resolves with the id and the new status', async () => {
    const result = await patchCandidateStatus('c-1', 'invited')
    expect(result).toEqual({ id: 'c-1', status: 'invited' })
  })
})
