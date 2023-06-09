import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  password,
  timestamp,
  checkbox,
  image,
} from '@keystone-6/core/fields';
import type { Lists } from '.keystone/types';


export const lists: Lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      todos: relationship({ 
        ref: 'Todo', 
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["task"],
          inlineEdit: { fields: ['task', 'isDone', 'due']},
          linkToItem: true,
          inlineCreate: { fields: ['task', 'isDone', 'due']}
        } 
    }),
    folders: relationship({ 
      ref: 'folder', 
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['name'],
        inlineEdit: { fields: ['name']},
        linkToItem: true,
        inlineCreate: { fields: ['name']}
      } 
    }),
    image: image({ storage: 'dpStorage'}),
    },
  }),
  folder: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true }}),
      todos: relationship({ 
        ref: 'Todo.folder', 
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["task"],
          inlineEdit: { fields: ['task', 'isDone', 'due']},
          linkToItem: true,
          inlineCreate: { fields: ['task', 'isDone', 'due']}
        } 
    })
    },
    hooks: {
      async beforeOperation({ operation, item, context}) {
        if (operation === 'delete') {
          const todoIds = await context.query.Todo.findMany({ where: { folder: {
            id: {
              equals: item.id
            }
          }}, query: 'id'});

          context.query.Todo.deleteMany({ where: todoIds });
        }
      }
    }
  }),
  Todo: list({
    access: allowAll,
    fields: {
      task: text({ validation: { isRequired: true }}),
      isDone: checkbox(),
      due: timestamp(),
      createdAt: timestamp({ defaultValue: { kind: 'now' }}),
      folder: relationship({
        ref: 'folder.todos', 
        many: false,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          linkToItem: true,
        }
      })
    }
  })
};
