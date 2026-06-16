import type { Candidate, CandidateStatus, Dataset } from '../types/candidate'
import { candidatesData, candidatesLargeData } from './mockData'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchCandidates = async (dataset: Dataset = 'small'): Promise<Candidate[]> => {
  await delay(500)
  return dataset === 'large' ? candidatesLargeData : candidatesData
}

export const patchCandidateStatus = async (
  id: string,
  status: CandidateStatus,
): Promise<{ id: string; status: CandidateStatus }> => {
  await delay(600)
  return { id, status }
}
