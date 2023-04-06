"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      todos: (0, import_fields.relationship)({
        ref: "Todo",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["task"],
          inlineEdit: { fields: ["task", "isDone", "due"] },
          linkToItem: true,
          inlineCreate: { fields: ["task", "isDone", "due"] }
        }
      }),
      folders: (0, import_fields.relationship)({
        ref: "folder",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineCreate: { fields: ["name"] }
        }
      }),
      image: (0, import_fields.image)({ storage: "dpStorage" })
    }
  }),
  folder: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      todos: (0, import_fields.relationship)({
        ref: "Todo.folder",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["task"],
          inlineEdit: { fields: ["task", "isDone", "due"] },
          linkToItem: true,
          inlineCreate: { fields: ["task", "isDone", "due"] }
        }
      })
    },
    hooks: {
      async beforeOperation({ operation, item, context }) {
        if (operation === "delete") {
          const todoIds = await context.query.Todo.findMany({ where: { folder: {
            id: {
              equals: item.id
            }
          } }, query: "id" });
          context.query.Todo.deleteMany({ where: todoIds });
        }
      }
    }
  }),
  Todo: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      task: (0, import_fields.text)({ validation: { isRequired: true } }),
      isDone: (0, import_fields.checkbox)(),
      due: (0, import_fields.timestamp)(),
      createdAt: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } }),
      folder: (0, import_fields.relationship)({
        ref: "folder.todos",
        many: false,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          linkToItem: true
        }
      })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "name",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password", "image"]
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    lists,
    session,
    server: {
      port: 3001,
      cors: {
        origin: ["http://localhost:3000"],
        credentials: true
      }
    },
    storage: {
      dpStorage: {
        type: "image",
        kind: "local",
        generateUrl: (path) => "http://localhost:3001/images/" + path,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      }
    }
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
