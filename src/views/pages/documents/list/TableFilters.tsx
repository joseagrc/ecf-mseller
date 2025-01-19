// React Imports
import { forwardRef, useState } from 'react'

// MUI Imports
import { Button, TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { TextFieldProps } from '@mui/material/TextField'
import { format } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import type { DocumentsFilterValues } from '@/types/DocumentTypes'

// Type Imports

interface TableFiltersProps {
  onFilterChange: (filters: DocumentsFilterValues) => void
}

type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | number
  start: Date | number
}

const documentTypes = {
  E31: 'Factura de Crédito Fiscal Electrónico',
  E32: 'Factura de Consumo Electrónica',
  E33: 'Nota de Débito Electrónica',
  E34: 'Nota de Crédito Electrónica',
  E41: 'Compras Electrónico',
  E43: 'Gastos Menores Electrónico',
  E44: 'Regímenes Especiales Electrónico',
  E45: 'Gubernamental Electrónico'
}

const statusOptions = [
  'No encontrado',
  'Aceptado',
  'Rechazado',
  'En Proceso',
  'Aceptado Condicional',
  'En Cola',
  'Enviado a la DGII',
  'Error'
]

const environments = [
  { label: 'Prueba | TesteCF', value: 'TesteCF' },
  { label: 'Certificación | CerteCF', value: 'CerteCF' },
  { label: 'Producción | eCF', value: 'eCF' }
]

export const parameters = {
  fromDate: null,
  toDate: null,
  documentType: '',
  status: '',
  internalTrackId: '',
  showData: false,
  environment: 'TesteCF',
  limit: 2,
  ecf: ''
}

const TableFilters = ({ onFilterChange }: TableFiltersProps) => {
  const [startDate, setStartDate] = useState<Date | null | undefined>(null)
  const [endDate, setEndDate] = useState<Date | null | undefined>(null)

  const [filters, setFilters] = useState<DocumentsFilterValues>(parameters)

  const handleFilterChange = (field: keyof DocumentsFilterValues, value: any) => {
    const newFilters = { ...filters, [field]: value }

    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = start && format(start, 'dd/MM/yyyy')
    const endDate = end !== null ? ` - ${format(end, 'dd/MM/yyyy')}` : null

    const value = `${startDate ? startDate : ''}${endDate !== null ? endDate : ''}`

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })

  const handleOnChange = (dates: any) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)

    if (start && end) {
      const date1 = new Date(start.setHours(0, 0, 0, 0)).getTime()
      const date2 = new Date(end.setHours(23, 59, 59, 999)).getTime()

      const newFilters = { ...filters, fromDate: date1, toDate: date2 }

      setFilters(newFilters)
      onFilterChange(newFilters)
    }
  }

  const handleReset = () => {
    const resetFilters = { ...parameters }

    setFilters(resetFilters)
    setStartDate(null)
    setEndDate(null)
    onFilterChange(resetFilters)
  }

  return (
    <Grid container spacing={3} sx={{ p: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label='eCF'
          value={filters.ecf}
          onChange={e => handleFilterChange('ecf', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Documento</InputLabel>
          <Select
            value={filters.documentType}
            onChange={e => handleFilterChange('documentType', e.target.value)}
            label='Tipo de Documento'
          >
            <MenuItem value=''>All</MenuItem>
            {Object.entries(documentTypes).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AppReactDatepicker
          selectsRange
          endDate={endDate as Date}
          selected={startDate}
          startDate={startDate as Date}
          id='date-range-picker'
          onChange={handleOnChange}
          shouldCloseOnSelect={false}
          customInput={
            <CustomInput label='Rango de Fecha' start={startDate as Date | number} end={endDate as Date | number} />
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} label='Status'>
            <MenuItem value=''>All</MenuItem>
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label='Internal Track ID'
          value={filters.internalTrackId}
          onChange={e => handleFilterChange('internalTrackId', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel>Entorno</InputLabel>
          <Select
            value={filters.environment}
            onChange={e => handleFilterChange('environment', e.target.value)}
            label='Entorno'
          >
            {environments.map(env => (
              <MenuItem key={env.value} value={env.value}>
                {env.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        {/* <FormControlLabel
          control={
            <Checkbox checked={filters.showData} onChange={e => handleFilterChange('showData', e.target.checked)} />
          }
          label='Show Data'
        /> */}
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Button fullWidth startIcon={<i className='mdi-reload' />} onClick={handleReset} sx={{ height: '56px' }}>
          Restaurar filtro
        </Button>
      </Grid>
    </Grid>
  )
}

export default TableFilters
