import { useEffect, useState } from 'react'

import { LoadingButton } from '@mui/lab'

import { Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import axios from 'axios'
import dayjs from 'dayjs'

import LoadingWrapper from '@/components/LoadingWrapper'

interface CertificateData {
  expirationDate: string
  createdAt: number
  rnc: string
  certificateKey: string
}

const CertificateTable = () => {
  const [data, setData] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCertificate = async () => {
    try {
      const response = await axios.get('/api/certificate')

      setData(response.data.data)
    } catch (err) {
      setError('Error fetching certificate data')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (certificateKey: string) => {
    try {
      const response = await axios.get(`api/certificate?file=${certificateKey}`)
      const { presignedUrl } = response.data

      const fileName = `${certificateKey.split('/').pop()}.xml`
      const link = document.createElement('a')

      link.href = presignedUrl
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Error downloading certificate:', err)
    }
  }

  useEffect(() => {
    fetchCertificate()
  }, [])

  if (loading) return <LoadingWrapper isLoading={loading}>{''}</LoadingWrapper>

  if (error)
    return (
      <Alert severity='error' sx={{ m: 5 }}>
        {error}
      </Alert>
    )

  if (!data) return null

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '25%' }}>RNC</TableCell>
            <TableCell style={{ width: '25%' }}>Expira en</TableCell>
            <TableCell style={{ width: '25%' }}>Fecha de Creación</TableCell>
            <TableCell style={{ width: '25%' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{data.rnc}</TableCell>
            <TableCell>{`${dayjs(data.expirationDate).diff(dayjs(), 'day')} días`}</TableCell>
            <TableCell>{dayjs(data.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
            <TableCell>
              <LoadingButton
                variant='contained'
                startIcon={<i className='mdi--download-circle-outline' />}
                onClick={() => handleDownload(data.certificateKey)}
                loading={loading}
              >
                Descargar Certificado
              </LoadingButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CertificateTable
