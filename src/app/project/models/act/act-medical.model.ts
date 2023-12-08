import { CoreBaseModel, GQLCrudName, UIFileInterface } from '../../../exports/lib';

@GQLCrudName({
  name: "act-medical"
})
export class ActMedicalModel extends CoreBaseModel {

  productCategoryId: string;
  ananmesis: string;
  medicalReport: string;
  isPregnant: boolean;
  pregnant?: {
    lastRuleDate: Date,
    weekNumber: number,
    possibleDateOfBirth: Date
  };
  vitalSign?: {
    oxygenSaturation: number,
    bodyTemperature: number,
    heartFrecuency: number,
    bloodPressure: number,
    breathingFrecuency: number,
    resultOxygen: string
  };
  antrophometry?: {
    weight: number,
    height: number,
    bodyMassiveIndex: string,
    abdominalPerimeter: string,
    clinicalExamination: string,
    expedient: string,
    resultIMC: string
  };
  diagnostics: Array<{
    diagnosticId: string,
    diagnosticName: string,
    code: string,
    diagnosticType: string,
    observation: string
  }>;
  prescriptions: Array<{
    title: string,
    indication: string,
    observation: string,
    medicines: Array<{
      medicineId: string,
      indication: string,
      posology: string,
      quantity: number
    }>
  }>;
  documents?: Array<{
    title: string,
    responsibleDoctor: string
    attachments: Array<UIFileInterface>
  }>;
  createdAt: Date;
  active: boolean;
}