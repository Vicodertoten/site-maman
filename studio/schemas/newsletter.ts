// studio/schemas/newsletter.ts
export const newsletter = {
  name: 'newsletter',
  title: 'Newsletter Subscriptions',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Unsubscribed', value: 'unsubscribed' }
        ]
      },
      initialValue: 'active'
    }
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'subscribedAt'
    }
  }
};