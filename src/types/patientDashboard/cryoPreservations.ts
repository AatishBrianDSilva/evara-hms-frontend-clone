import { IDoctor } from '../doctor'
import { ECryoPreservationType, IMasterCryoPreservations } from '../master'
import { IPatient } from '../patient'

export interface IEditCryoPreservationForm<T> {
  details: T
  status: string
  notes?: string
  files?: string[]
}

export interface IEditCryoPreservationPayload {
  details?: {
    procedureName: string
    details: any
    files?: string[]
    notes?: string
  }
  status: string
  testType: ECryoPreservationType
}

export interface IPatientCryoPreservation {
  _id: string
  clinicId: string
  branchId?: string
  patient: IPatient
  doctor?: IDoctor
  patientCode: string
  cryo: IMasterCryoPreservations
  details: ICryoPreservationDetails
  date: Date
  status: string
  caseId?: string
  createdAt: Date
  updatedAt: Date
  __v: number
}

interface ICryoPreservationDetails {
  _id: string
  cryoPreservationName: string
  details: any
  files?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}
