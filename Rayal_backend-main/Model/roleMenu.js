const mongoose = require("mongoose");
const { Schema } = mongoose;

var PermissionField = new Schema(
  {
    edit: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    view: {
      type: Boolean,
      default: false,
    },
    download: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const roleTableSchema = new Schema({
  role: {
    type: String,
    trim: true,
    unique: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
});

const menuTableSchema = new Schema({
  menuName: {
    type: String,
    trim: true,
    unique: true,
  },
  link: {
    type: String,
    trim: true,
  },
  permission: {
    type: PermissionField,
  },
  parentId: {
    type: String,
    default: "",
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
});

const menuRoleTableSchema = new Schema({
  menuId: {
    type: String,
    trim: true,
    unique: true,
  },
  roleId: {
    type: String,
    trim: true,
    unique: true,
  },
  permission: {
    type: PermissionField,
  },
  remarks: {
    type: String,
    trim: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
});

const userMenuTableSchema = new Schema({
  userId: {
    type: String,
    trim: true,
    unique: true,
  },
  menuId: {
    type: String,
    trim: true,
    unique: true,
  },
  permission: {
    type: PermissionField,
  },
  remarks: {
    type: String,
    trim: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
});

const Role = mongoose.model("role", roleTableSchema, "role");
const Menu = mongoose.model("menu", menuTableSchema, "menu");
const MenuRole = mongoose.model("menuRole", menuRoleTableSchema, "menuRole");
const UserMenu = mongoose.model("userMenu", userMenuTableSchema, "userMenu");
module.exports = { Role, Menu, MenuRole, UserMenu };
