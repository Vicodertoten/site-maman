import { Box, Card, Grid, Stack, Text } from '@sanity/ui'
import { PatchEvent, set, unset } from 'sanity'
import { useMemo, useCallback } from 'react'

const calendarWeekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const statusPalette: Record<string, { background: string; border: string; text: string }> = {
  Disponible: { background: '#e8f5f0', border: '#4a7c59', text: '#114433' },
  Indisponible: { background: '#fbe8f2', border: '#a34382', text: '#4e173a' }
}

const normalizeDateKey = (value?: string) => {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const buildCalendarCells = (
  year: number,
  month: number,
  slotsByDate: Map<string, any>
) => {
  const firstOfMonth = new Date(year, month, 1)
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = firstWeekday + daysInMonth
  const rows = Math.ceil(totalCells / 7)

  const cells = []
  for (let index = 0; index < rows * 7; index += 1) {
    const dayIndex = index - firstWeekday + 1
    const isCurrentMonth = index >= firstWeekday && dayIndex <= daysInMonth
    const day = isCurrentMonth ? dayIndex : undefined
    const dateKey = isCurrentMonth
      ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayIndex).padStart(2, '0')}`
      : undefined
    const existingSlot = dateKey ? slotsByDate.get(dateKey) : undefined
    const status = existingSlot?.status ?? 'Disponible'
    cells.push({ day, dateKey, isCurrentMonth, status })
  }
  return cells
}

const makeSlotKey = (dateKey: string) => `slot-${dateKey}-${Date.now().toString(36)}`

interface CompanyAgendaCalendarInputProps {
  value?: Array<Record<string, unknown>>
  onChange: (event: ReturnType<typeof PatchEvent.from>) => void
  readOnly?: boolean
  document?: Record<string, unknown>
}

export function CompanyAgendaCalendarInput({ value, onChange, readOnly, document }: CompanyAgendaCalendarInputProps) {
  const slotArray = Array.isArray(value) ? value : []
  const slotsByDate = useMemo(() => {
    const map = new Map<string, Record<string, unknown>>()
    slotArray.forEach(slot => {
      const dateKey = normalizeDateKey(slot?.date as string | undefined)
      if (dateKey) {
        map.set(dateKey, slot)
      }
    })
    return map
  }, [slotArray])

  const earliestSlotDate = useMemo(() => {
    for (const slot of slotArray) {
      const dateKey = slot?.date as string | undefined
      const parsed = dateKey ? new Date(dateKey) : null
      if (parsed && !Number.isNaN(parsed.getTime())) {
        return parsed
      }
    }
    return new Date()
  }, [slotArray])

  const startMonthCandidate = document?.startMonth ? new Date(document.startMonth as string) : null
  const normalizedStartMonth = useMemo(() => {
    const source = startMonthCandidate && !Number.isNaN(startMonthCandidate.getTime())
      ? startMonthCandidate
      : earliestSlotDate
    return new Date(source.getFullYear(), source.getMonth(), 1)
  }, [startMonthCandidate, earliestSlotDate])

  const monthsToShow = Math.max(1, Math.min(4, Number(document?.monthsToShow ?? 2)))
  const months = useMemo(() => {
    return Array.from({ length: monthsToShow }, (_, index) => {
      const monthDate = new Date(normalizedStartMonth.getFullYear(), normalizedStartMonth.getMonth() + index, 1)
      return {
        year: monthDate.getFullYear(),
        month: monthDate.getMonth(),
        label: monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        cells: buildCalendarCells(monthDate.getFullYear(), monthDate.getMonth(), slotsByDate)
      }
    })
  }, [monthsToShow, normalizedStartMonth, slotsByDate])

  const handleDayClick = useCallback((dateKey: string | undefined) => {
    if (readOnly || !dateKey) return
    const existing = slotsByDate.get(dateKey)
    const filtered = slotArray.filter(slot => normalizeDateKey(slot?.date as string | undefined) !== dateKey)

    if (existing?.status === 'Indisponible') {
      const nextValue = filtered.length === 0 ? null : filtered
      onChange(PatchEvent.from(nextValue ? set(nextValue) : unset()))
      return
    }

    const newSlot = {
      _key: existing?._key || makeSlotKey(dateKey),
      date: dateKey,
      status: 'Indisponible'
    }
    const combined = [...filtered, newSlot].sort((a, b) => {
      const dateA = new Date(a?.date as string ?? 0).getTime()
      const dateB = new Date(b?.date as string ?? 0).getTime()
      return dateA - dateB
    })
    onChange(PatchEvent.from(set(combined)))
  }, [readOnly, slotsByDate, slotArray, onChange])

  if (!months.length) {
    return (
      <Card padding={4} tone="caution">
        <Text size={1}>Ajoute d'abord un créneau pour voir le calendrier.</Text>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <Card padding={3} tone="transparent">
        <Text size={1} muted>
          Cliquez sur un jour pour basculer Disponible / Indisponible.
        </Text>
      </Card>
      <Grid columns={[1, 2]} gap={3}>
        {months.map(month => (
          <Card key={month.label} padding={3} radius={2} shadow={1} tone="default">
            <Text size={1} weight="semibold" align="center" style={{ textTransform: 'uppercase', letterSpacing: '0.3em' }}>
              {month.label}
            </Text>
            <Grid columns={7} gap={1} style={{ marginTop: 6 }}>
              {calendarWeekDays.map(day => (
                <Text key={`${month.label}-${day}`} size={0} align="center" style={{ letterSpacing: '0.2em' }}>
                  {day}
                </Text>
              ))}
            </Grid>
            <Grid columns={7} gap={1} style={{ marginTop: 4 }}>
              {month.cells.map((cell, index) => {
                const palette = statusPalette[cell.status] ?? statusPalette.Disponible
                return (
                  <Box
                    key={`${month.label}-${cell.dateKey ?? 'empty'}-${index}`}
                    as="button"
                    type="button"
                    onClick={() => handleDayClick(cell.dateKey)}
                    disabled={!cell.isCurrentMonth}
                    padding={0}
                    style={{
                      border: `1px solid ${palette.border}`,
                      borderRadius: 8,
                      backgroundColor: cell.isCurrentMonth ? palette.background : '#f4f4f4',
                      color: palette.text,
                      height: 38,
                      display: 'grid',
                      placeItems: 'center',
                      cursor: cell.isCurrentMonth ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <Text size={1} weight="semibold">
                      {cell.day ?? ''}
                    </Text>
                  </Box>
                )
              })}
            </Grid>
          </Card>
        ))}
      </Grid>
    </Stack>
  )
}
