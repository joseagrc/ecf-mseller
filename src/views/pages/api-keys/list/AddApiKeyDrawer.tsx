// React Imports

// MUI Imports
import { AppDispatch, RootState } from '@/redux-store'
import { addApiKey, toggleDrawer } from '@/redux-store/slices/apiKeySlice'
import { ApiKeyInputType } from '@/types/ApiKeyTypes'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddApiKeyDrawer = () => {
  // Hooks
  const dispatch = useDispatch<AppDispatch>()
  const apiKeyStore = useSelector((state: RootState) => state.apiKeyReducer)
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ApiKeyInputType>({
    defaultValues: {
      stage: 'TesteCF',
      description: ''
    }
  })

  const handleClose = () => {
    dispatch(toggleDrawer(null))
  }

  const onSubmit = (data: ApiKeyInputType) => {
    dispatch(addApiKey(data))
    handleClose()
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
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Agregar nueva API Key</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <FormControl fullWidth error={!!errors.stage}>
            <InputLabel id='stage-label'>Entorno</InputLabel>
            <Controller
              name='stage'
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              render={({ field }) => (
                <Select labelId='stage-label' label='Entorno' {...field}>
                  <MenuItem value='TesteCF'>Prueba</MenuItem>
                  <MenuItem value='CerteCF'>Certificación</MenuItem>
                  <MenuItem value='eCF'>Producción</MenuItem>
                </Select>
              )}
            />
            {errors.stage && <FormHelperText>{errors.stage.message}</FormHelperText>}
          </FormControl>
          <Controller
            name='description'
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Descripción'
                placeholder='Descripción'
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Crear
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddApiKeyDrawer
