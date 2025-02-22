// React Imports
import { useCallback, useEffect, useRef, useState } from 'react'

// Next Imports

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, PaginationState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import axios from 'axios'
import classnames from 'classnames'

import { useDispatch, useSelector } from 'react-redux'

import {
  CardHeader,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'

import type { DocumentItem, DocumentsFilterValues, DocumentsParams } from '@/types/DocumentTypes'

import type { ThemeColor } from '@core/types'

// Component Imports

// Util Imports

// Style Imports
import LoadingWrapper from '@/components/LoadingWrapper'
import type { AppDispatch, RootState } from '@/redux-store'
import { getDocuments } from '@/redux-store/slices/documentSlice'
import tableStyles from '@core/styles/table.module.css'
import AddApiKeyDrawer from './AddApiKeyDrawer'
import TableFilters, { parameters } from './TableFilters'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type StatusChipColorType = {
  color: ThemeColor
}

export const statusChipColor: { [key: string]: StatusChipColorType } = {
  Aceptado: { color: 'success' },
  'Aceptado Condicional': { color: 'warning' },
  'En Proceso': { color: 'info' },
  'No encontrado': { color: 'info' },
  'En Cola': { color: 'info' },
  'Enviado a la DGII': { color: 'info' },
  Error: { color: 'error' },
  Rechazado: { color: 'error' }
}

const fuzzyFilter: FilterFn<any> = (): any => {}

const DocumentListTable = () => {
  // States
  // Add loading state
  const [downloadingIds, setDownloadingIds] = useState<string[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dgiiResponses, setDgiiResponses] = useState<string[]>([])

  const dispatch = useDispatch<AppDispatch>()
  const documentStore = useSelector((state: RootState) => state.documentReducer)

  const [params, setParams] = useState<DocumentsParams>(parameters)

  //const [nextTokens, setNextTokens] = useState<Map<number, string>>(new Map([[0, '']]))
  const nextTokens = useRef(new Map([[0, '']]))

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: parameters.limit
  })

  const init = useCallback(async () => {
    const response = await dispatch(getDocuments(params)).unwrap()

    nextTokens.current.set(1, response.nextToken)
  }, [dispatch, params])

  useEffect(() => {
    init()
  }, [init])

  const handleOpenDialog = (responses: string[]) => {
    setDgiiResponses(responses)
    setOpenDialog(true)
  }

  const handleDownload = useCallback(
    async (id: string, documentKey: string) => {
      if (downloadingIds.includes(id)) return

      setDownloadingIds(prev => [...prev, id])

      try {
        const response = await axios.get(`/api/documents/download?file=${documentKey}`)
        const { presignedUrl } = response.data

        const fileName = `${documentKey.split('/').pop()}.xml`
        const link = document.createElement('a')

        link.href = presignedUrl
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (error) {
        console.error('Download failed:', error)
      } finally {
        setDownloadingIds(prev => prev.filter(downloadId => downloadId !== id))
      }
    },
    [downloadingIds]
  )

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const columns = (): ColumnDef<DocumentItem>[] => [
    {
      accessorKey: 'ncf',
      header: 'eCF',
      cell: ({ row }) => <span>{row.original.ncf}</span>
    },

    {
      accessorKey: 'value',
      header: 'Tipo Documento',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>{row.original.documentType}</span>
        </Box>
      )
    },

    {
      accessorKey: 'createdDate',
      header: 'Creado',
      cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    },
    {
      accessorKey: 'enabled',
      header: 'Status',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          color={statusChipColor[row.original.status].color}
          variant='tonal'
          size='small'
        />
      )
    },
    {
      id: 'actions',
      header: 'Acción',
      cell: ({ row }) => (
        <div className='flex items-center'>
          {/* <Tooltip title='Re-enviar documento | Se implementará en la próxima versión'>
            <IconButton onClick={() => {}}>
              <i className='ri-mail-send-fill' />
            </IconButton>
          </Tooltip> */}
          <Tooltip title='Verificación e-NCF'>
            <span>
              <IconButton onClick={() => window.open(row.original.qr_url, '_blank')} disabled={!row.original.qr_url}>
                <i className='ri-receipt-line' />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title='Descargar XML'>
            <IconButton onClick={() => handleDownload(row.id, row.original.signedXml)}>
              {downloadingIds.includes(row.id) ? <CircularProgress size={20} /> : <i className='mdi-file-xml-box' />}
            </IconButton>
          </Tooltip>
          {row.original.summarySignedXml && (
            <Tooltip title='Descargar Resumen XML'>
              <IconButton onClick={() => handleDownload(row.id, row.original.summarySignedXml!)}>
                {downloadingIds.includes(row.id) ? <CircularProgress size={20} /> : <i className='mdi-file-xml-box' />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title='Ver Respuesta DGII'>
            <IconButton onClick={() => handleOpenDialog(row.original.dgiiResponse)}>
              <i className='ri-eye-line text-textSecondary' />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ]

  const table = useReactTable({
    data: documentStore.data.items,
    columns: columns(),

    state: {
      pagination,
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: parameters.limit
      }
    },
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    filterFns: { fuzzy: fuzzyFilter }
  })

  const onFilterChange = (value: DocumentsFilterValues) => {
    setParams({ ...params, ...value })
    dispatch(getDocuments({ ...params, ...value }))
  }

  const handlePageChange = useCallback(
    async (_: any, newPage: number) => {
      const pageDirection = newPage > pagination.pageIndex ? 'next' : 'prev'

      const currentToken = nextTokens.current.get(newPage)

      try {
        const response = await dispatch(
          getDocuments({
            ...params,
            nextToken: currentToken || ''
          })
        ).unwrap()

        // Store new nextToken if available
        if (response.nextToken && pageDirection === 'next') {
          nextTokens.current.set(newPage + 1, response.nextToken)
        }
        setPagination({
          pageIndex: newPage,
          pageSize: pagination.pageSize
        })
        table.setPageIndex(newPage)
      } catch (error) {
        console.error('Error changing page:', error)
      }
    },
    [nextTokens, dispatch, pagination.pageIndex, pagination.pageSize, params, table]
  )

  return (
    <>
      <AddApiKeyDrawer />
      <Card>
        <CardHeader title='Filtros de Documentos' />
        <TableFilters onFilterChange={onFilterChange} />
        <Divider />
        <CardContent className='flex justify-between max-sm:flex-col sm:items-center gap-4'>
          <Typography variant='h5'>Documentos</Typography>
          <Button
            variant='outlined'
            color='primary'
            startIcon={<i className='mdi-reload' />}
            onClick={() => dispatch(getDocuments(params))}
          >
            Actualizar
          </Button>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {table?.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    <LoadingWrapper isLoading={documentStore.isLoading}>No hay datos disponibles.</LoadingWrapper>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[parameters.limit]}
          component='div'
          className='border-bs'
          count={documentStore.data.metadata?.totalItems || 0}
          rowsPerPage={documentStore.data.metadata?.itemsPerPage || 0}
          page={pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Respuesta DGII
          <IconButton
            aria-label='close'
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <i className='mdi-close' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Respuesta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dgiiResponses.map((response, index) => (
                  <TableRow key={index}>
                    <TableCell>{response}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DocumentListTable
