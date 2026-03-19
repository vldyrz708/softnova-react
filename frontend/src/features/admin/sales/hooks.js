import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSalesReport, getSales, createSale } from './api.js'

export const useSalesReport = (periodo) =>
  useQuery({
    queryKey: ['sales-report', periodo],
    queryFn:  () => getSalesReport(periodo),
    staleTime: 60_000
  })

export const useSales = (page = 1) =>
  useQuery({
    queryKey: ['sales', page],
    queryFn:  () => getSales(page),
    staleTime: 30_000
  })

export const useCreateSale = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] })
      qc.invalidateQueries({ queryKey: ['sales-report'] })
    }
  })
}
