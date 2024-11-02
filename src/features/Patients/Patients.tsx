// Inside Patients.tsx
import ContentSection from '../../components/ContentSection/ContentSection';
import PatientsList from './PatientsList';
import GroupsIcon from '@mui/icons-material/Groups';

const Patients: React.FC = () => {
  return (
    <ContentSection title="Patients" icon={<GroupsIcon />}>
      <PatientsList />
    </ContentSection>
  );
};

export default Patients;
