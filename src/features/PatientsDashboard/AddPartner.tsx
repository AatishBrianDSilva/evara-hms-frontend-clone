import { Box, Modal, Typography } from '@mui/material'
import React from 'react'

interface IPatientDashboardAddPartnerProps {
  openAddPartnerModal: boolean
  onClose: (value: boolean) => void
}

const PatientDashboardAddPartner: React.FC<IPatientDashboardAddPartnerProps> = ({ openAddPartnerModal, onClose }) => {
  return (
    <Modal
      open={openAddPartnerModal}
      onClose={() => onClose(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box position={"absolute"} top={"50%"} left={"50%"} width={"40%"} boxShadow={5} p={4} bgcolor={"background.paper"} sx={{
        transform: 'translate(-50%, -50%)',
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  )

}

export default PatientDashboardAddPartner