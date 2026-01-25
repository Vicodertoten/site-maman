import { Card, Text, Button, Stack, Box, Heading, Grid } from '@sanity/ui'
import { DownloadIcon, UsersIcon } from '@sanity/icons'
import { useState, useEffect } from 'react'
import { useClient } from 'sanity'

interface Subscriber {
  _id: string
  email: string
  subscribedAt: string
  status: string
}

export function NewsletterTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const result = await client.fetch(`
        *[_type == "newsletter"] | order(subscribedAt desc) {
          _id,
          email,
          subscribedAt,
          status
        }
      `)
      setSubscribers(result)
    } catch (err) {
      console.error('Erreur lors de la récupération des abonnés:', err)
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (subscribers.length === 0) return

    // Créer le contenu CSV
    const headers = ['Email', 'Date d\'inscription', 'Statut']
    const csvContent = [
      headers.join(','),
      ...subscribers.map(sub => [
        `"${sub.email}"`,
        `"${new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}"`,
        `"${sub.status || 'active'}"`
      ].join(','))
    ].join('\n')

    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <Card padding={4}>
        <Text>Chargement des abonnés...</Text>
      </Card>
    )
  }

  if (error) {
    return (
      <Card padding={4} tone="critical">
        <Text>Erreur: {error}</Text>
        <Button onClick={fetchSubscribers} style={{ marginTop: '1rem' }}>
          Réessayer
        </Button>
      </Card>
    )
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        {/* En-tête avec statistiques */}
        <Card padding={4} radius={2} shadow={1}>
          <Grid columns={[1, 2, 3]} gap={4}>
            <Box>
              <Heading size={1}>
                <UsersIcon style={{ marginRight: '0.5rem' }} />
                {subscribers.length}
              </Heading>
              <Text size={1} muted>Abonnés à la newsletter</Text>
            </Box>
            <Box>
              <Button
                onClick={exportToCSV}
                disabled={subscribers.length === 0}
                tone="primary"
                icon={DownloadIcon}
                style={{ width: '100%' }}
              >
                Exporter en CSV
              </Button>
            </Box>
            <Box>
              <Button
                onClick={fetchSubscribers}
                mode="ghost"
                style={{ width: '100%' }}
              >
                Actualiser
              </Button>
            </Box>
          </Grid>
        </Card>

        {/* Liste des abonnés */}
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Heading size={1}>Liste des abonnés</Heading>

            {subscribers.length === 0 ? (
              <Text muted>Aucun abonné pour le moment.</Text>
            ) : (
              <Stack space={2}>
                {subscribers.map((subscriber) => (
                  <Card key={subscriber._id} padding={3} radius={1} shadow={0} tone="default">
                    <Grid columns={[1, 2, 3]} gap={2}>
                      <Box>
                        <Text weight="semibold">{subscriber.email}</Text>
                      </Box>
                      <Box>
                        <Text size={1} muted>
                          {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </Box>
                      <Box>
                        <Text size={1} style={{
                          color: subscriber.status === 'active' ? '#4a7c59' : '#e85d3a'
                        }}>
                          {subscriber.status === 'active' ? 'Actif' : 'Inactif'}
                        </Text>
                      </Box>
                    </Grid>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}