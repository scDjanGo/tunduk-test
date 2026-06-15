import type { Candidate, CandidateStatus } from '../types/candidate'
import { candidatesData } from './mockData'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchCandidates = async (): Promise<Candidate[]> => {
  await delay(500)
  return candidatesData
}

export const patchCandidateStatus = async (
  id: string,
  status: CandidateStatus,
): Promise<{ id: string; status: CandidateStatus }> => {
  await delay(600)
  return { id, status }
}
