export interface IDicomMetaData {
  patientName: string;
  patientId: string;
  modality: string;
  studyDate: string;
  rows: number;
  columns: number;
  bitsAllocated: number;
  bitsStored: number;
  highBit: number;
  pixelRepresentation: number; // 0 = unsigned, 1 = signed
  photometricInterpretation: string;
  rescaleIntercept: number;
  rescaleSlope: number;
  windowCenter: number;
  windowWidth: number;
  transferSyntaxUid: string;
}
