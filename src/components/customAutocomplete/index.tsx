import React from 'react'

import { Autocomplete, TextField, Chip } from '@mui/material'
import { Controller, type Control } from 'react-hook-form'

interface OptionType {
  label: string
  value: string | number
  isNew?: boolean
}

interface CustomAutocompleteProps {
  name: string
  control: Control<any>
  options: OptionType[]
  label: React.ReactNode | string
  freeSolo?: boolean
  placeholder?: string
  rules?: any
}

const CustomAutocomplete = ({
  name,
  control,
  options,
  label,
  freeSolo = false,
  placeholder,
  rules
}: CustomAutocompleteProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          freeSolo={freeSolo}
          options={options}
          value={
            typeof value === 'string' && freeSolo
              ? { label: value, value, isNew: true }
              : options.find(option => option.value === value) || null
          }
          onChange={(_, newValue) => {
            // Store only the string value
            if (typeof newValue === 'string') {
              onChange(newValue)
            } else if (newValue) {
              // Store the value property regardless if it's a new option or existing one
              onChange(newValue.label)
            } else {
              onChange(null)
            }
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault() // Prevent form submission
            }
          }}
          getOptionLabel={option => {
            if (typeof option === 'string') return option

            return option?.label || ''
          }}
          renderOption={(props, option) => (
            <li {...props}>
              {option.isNew ? (
                <span>
                  Crear &quot;{option.label}&quot;
                  <Chip size='small' label='Nuevo' color='primary' sx={{ ml: 1 }} />
                </span>
              ) : (
                option.label
              )}
            </li>
          )}
          renderInput={params => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message}
              variant='outlined'
            />
          )}
          filterOptions={(options, params) => {
            const filtered = options.filter(option =>
              option.label.toLowerCase().includes(params.inputValue.toLowerCase())
            )

            if (freeSolo && params.inputValue !== '') {
              filtered.push({
                label: params.inputValue,
                value: params.inputValue,
                isNew: true
              })
            }

            return filtered
          }}
        />
      )}
    />
  )
}

export default CustomAutocomplete
