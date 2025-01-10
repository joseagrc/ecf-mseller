// React Imports

// MUI Imports
import Drawer from '@mui/material/Drawer'

import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '@/redux-store'
import { toggleDrawer } from '@/redux-store/slices/apiKeySlice'
import AddApiKeyForm from './AddApiKeyForm'

const AddApiKeyDrawer = () => {
  // Hooks
  const dispatch = useDispatch<AppDispatch>()
  const apiKeyStore = useSelector((state: RootState) => state.apiKeyReducer)

  const handleClose = () => {
    dispatch(toggleDrawer(null))
  }

  const handleReset = () => {
    handleClose()
  }

  return (
    <Drawer
      open={apiKeyStore.isDrawerOpen}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <AddApiKeyForm />
    </Drawer>
  )
}

export default AddApiKeyDrawer
