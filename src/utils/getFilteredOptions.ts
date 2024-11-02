import { IDoctor } from '../types/doctor';
import { FilterOptionType } from '../types/global';
import {
  IMasterCryoPreservations,
  IMasterInvestigation,
  IMasterProcedures,
  IMasterService,
  IMasterTreatmentCycle,
  IMasterPackages,
} from '../types/master';

type FieldType = {
  procedure?: IMasterProcedures | null;
  investigation?: IMasterInvestigation | null;
  cryoPreservation?: IMasterCryoPreservations | null;
  treatmentCycle?: IMasterTreatmentCycle | null;
  doctor?: IDoctor | null;
  service?: IMasterService | null;
  package?: IMasterPackages | null;
};

function getIdFromField(
  field: FieldType,
  key:
    | 'investigation'
    | 'procedure'
    | 'cryoPreservation'
    | 'treatmentCycle'
    | 'service'
    | 'package',
): string | undefined {
  const item = field[key];
  return item ? item._id : undefined;
}

const getFilteredOptions = (
  currentIndex: number,
  options: FilterOptionType[],
  selectedKey:
    | 'investigation'
    | 'procedure'
    | 'cryoPreservation'
    | 'treatmentCycle'
    | 'service'
    | 'package',
  fields: FieldType[],
) => {
  // Calculate selected IDs excluding the current index
  const selectedIds = fields
    .filter((_, index) => index !== currentIndex)
    .map(field => getIdFromField(field, selectedKey))
    .filter((id): id is string => id !== undefined);

  // Filter options to exclude those that are already selected
  return options.filter(option => !selectedIds.includes(option._id));
};

export default getFilteredOptions;
