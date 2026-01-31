import { CompanyAgendaCalendarInput } from '../src/components/CompanyAgendaCalendarInput'

export const companyAgenda = {
  name: 'companyAgenda',
  title: 'Agenda entreprises',
  type: 'document',
  fieldsets: [
    {
      name: 'visibility',
      title: 'Affichage (avancé)',
      options: { collapsible: true, collapsed: true }
    }
  ],
  fields: [
    {
      name: 'title',
      title: 'Titre interne',
      type: 'string',
      initialValue: 'Agenda entreprises'
    },
    {
      name: 'description',
      title: 'Description interne',
      type: 'text',
      initialValue:
        'Gérez les créneaux disponibles pour les entreprises (dates, horaires, statuts).'
    },
    {
      name: 'calendarTitle',
      title: 'Titre visible sur le site',
      type: 'string',
      initialValue: 'Disponibilités entreprises'
    },
    {
      name: 'startMonth',
      title: 'Mois de départ affiché',
      type: 'date',
      initialValue: '2026-02-01',
      description: 'Choisissez le mois qui apparaîtra en premier dans le calendrier.'
    },
    {
      name: 'monthsToShow',
      title: 'Nombre de mois visibles',
      type: 'number',
      initialValue: 2,
      description: 'Définissez combien de mois consécutifs doivent être affichés.'
    },
    {
      name: 'slots',
      title: 'Créneaux disponibles',
      type: 'array',
      components: {
        input: CompanyAgendaCalendarInput
      },
      of: [
        {
          type: 'object',
          name: 'slot',
          title: 'Créneau',
          fields: [
            {
              name: 'date',
              title: 'Date',
              type: 'date'
            },
            {
              name: 'status',
              title: 'Statut',
              type: 'string',
              options: {
                list: [
                  { title: 'Disponible', value: 'Disponible' },
                  { title: 'Indisponible', value: 'Indisponible' }
                ]
              },
              initialValue: 'Indisponible'
            }
          ]
        }
      ],
      description: 'Par défaut, tous les jours sont disponibles. Cliquez pour marquer des jours indisponibles.'
    },
    {
      name: 'isVisible',
      title: 'Afficher la section agenda',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    }
  ]
}
