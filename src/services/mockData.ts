import candidatesJson from '../../mock/candidates.json'
import candidatesLargeJson from '../../mock/candidates-large.json'
import type { Candidate } from '../types/candidate'

export const candidatesData = candidatesJson as Candidate[]
export const candidatesLargeData = candidatesLargeJson as Candidate[]
