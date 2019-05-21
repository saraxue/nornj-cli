import { types } from 'mobx-state-tree';
import { observable, toJS } from 'mobx';
import axios from 'axios';
import Notification from '../../utils/notification';

const Page1Store = types
  .model('Page1Store', {
    isDisable: types.optional(types.boolean, true),
    activeKey: types.optional(types.string, 'tab1'),
    addModalVisible: false,
    editModalVisible: false,
    saveBtnDisabled: false,
    addInputRole: '',
    addInputDes: '',
    roleId: 0,
    expandedKeys: types.optional(types.array(types.string), []),
    checkedKeys: types.optional(types.array(types.string), []),
    detailModalVisible: false
  })
  .volatile(self => ({
    tableData: null,
    tableDataO: null,
    searchData: null,
    addRoleData: null,
    treeData: null,
    addRoleId: null,
    menuIds: null,
    authTreeData: null,
    menuData: null,
    detailData: []
  }))
  .views(self => ({
    //获取树节点的展开形式
    getExpandedKeys(arr) {
      return arr.filter(n => n.level == 1 || n.level == 2).map(m => {
        return m.id.toString();
      });
    },

    getDefaultCheckedKeys() {
      let keys = [];
      self.menuData.filter(n => n.level == 3).forEach(item => {
        if (item.selected) {
          keys.push(item.id.toString());
        }
      });
      return keys;
    },

    getAuthTreeDataMap(authList) {
      const authTreeDataMap = {};
      authList.forEach(node => {
        authTreeDataMap[node.id] = node;
      });

      return authTreeDataMap;
    },

    getAuthTreeData(authList, authMap, level = 1, node, pids = []) {
      if (level == 4) {
        return null;
      }

      return authList.filter(n => n.level == level && (!node ? true : n.pid == node.id.toString())).map(n => {
        authMap[n.id].pids = pids;

        return {
          key: n.id.toString(),
          title: n.name,
          children: self.getAuthTreeData(authList, authMap, level + 1, n, [...pids, n.id.toString()])
        };
      });
    }
  }))
  .actions(self => ({
    afterCreate() {
      self.authTreeDataMap = null;
    },

    setAddModalVisible(v) {
      self.addModalVisible = v;
    },

    setEditModalVisible(v) {
      self.editModalVisible = v;
    },

    setSaveBtnDisabled(v) {
      self.saveBtnDisabled = v;
    },

    setAddInputRole(v) {
      self.addInputRole = v;
    },

    setAddInputDes(v) {
      self.addInputDes = v;
    },

    setRoleId(v) {
      self.roleId = v;
    },

    setExpandedKeys(v) {
      self.expandedKeys = v;
    },

    setCheckedKeys(v) {
      self.checkedKeys = v;
    },

    setDetailModalVisible(v) {
      self.detailModalVisible = v;
    },

    setDetailData(v) {
      self.detailData = v;
    },

    setMenuIds(checkeds) {
      self.menuIds = checkeds.join();
    },

    setTableData(value) {
      self.tableData = value;
    },

    setDisable(value) {
      self.isDisable = value;
    },

    setActiveKey(value) {
      self.activeKey = value;
    },

    initTree() {
      self.expandedKeys = self.getExpandedKeys(toJS(self.menuData));
      self.checkedKeys = self.getDefaultCheckedKeys();
    },

    getRoleMenuTree(params) {
      return axios
        .get(`${__HOST}/page1/getRoleMenuTree`, {
          params
        })
        .then(self.setRoleMenuTree)
        .catch(ex => {
          Notification.error({
            description: '获取角色权限数据异常:' + ex,
            duration: null
          });
        });
    },

    setRoleMenuTree({ data: result }) {
      if (result.success) {
        self.menuData = result.data;
        self.authTreeDataMap = self.getAuthTreeDataMap(result.data);
        self.authTreeData = self.getAuthTreeData(result.data, self.authTreeDataMap);
      } else {
        Notification.error({
          description: '获取角色权限数据错误:' + result.message,
          duration: null
        });
      }
    },

    getRoleManagementData(params) {
      return axios
        .get(
          __Remote ? `${__HOST}/remoteServer/page1/getRoleManagementData` : `${__HOST}/page1/getRoleManagementData`,
          {
            params
          }
        )
        .then(self.setRoleManagementData)
        .catch(ex => {
          Notification.error({
            description: '获取角色管理数据异常:' + ex,
            duration: null
          });
        });
    },

    setRoleManagementData({ data: result }) {
      if (result.success) {
        const data = result.data;
        self.tableDataO = self.tableData = data.length > 0 ? data : [];
      } else {
        Notification.error({
          description: '获取角色管理度数据异常:' + result.message,
          duration: null
        });
      }
    },

    searchRole(params) {
      return axios
        .get(`${__HOST}/page1/searchRole`, {
          params
        })
        .then(self.setSearchRole)
        .catch(ex => {
          Notification.error({
            description: '获取角色数据异常:' + ex,
            duration: null
          });
        });
    },

    setSearchRole({ data: result }) {
      if (result.success) {
        const data = result.data;
        self.searchData = data;
      } else {
        Notification.error({
          description: '获取角色数据异常:' + result.message,
          duration: null
        });
      }
    },

    saveRole(params) {
      return axios
        .post(`${__HOST}/page1/saveRole`, params)
        .then(self.setSaveRole)
        .catch(ex => {
          Notification.error({
            description: '添加角色数据异常:' + ex,
            duration: null
          });
        });
    },

    setSaveRole({ data: result }) {
      if (result.success) {
        const data = result.data;
        self.addRoleId = data.roleId;
        Notification.success({ description: '添加角色成功！', duration: 2 });
        self.setDisable(false);
      } else {
        Notification.error({
          description: '添加角色数据异常:' + result.message,
          duration: null
        });
      }
    },

    saveRolePermission(params) {
      return axios
        .post(`${__HOST}/page1/saveRolePermission`, params)
        .then(self.setSaveRolePermission)
        .catch(ex => {
          Notification.error({
            description: '添加角色权限数据异常:' + ex,
            duration: null
          });
        });
    },

    setSaveRolePermission({ data: result }) {
      if (result.success) {
        Notification.success({
          description: '添加角色权限成功！',
          duration: 2
        });
      } else {
        Notification.error({
          description: '添加角色权限数据异常:' + result.message,
          duration: null
        });
      }
    },

    deleteRole(params) {
      return axios
        .post(`${__HOST}/page1/deleteRole`, params)
        .then(self.setDeleteRole)
        .catch(ex => {
          Notification.error({
            description: '删除角色数据异常:' + ex,
            duration: null
          });
        });
    },

    setDeleteRole({ data: result }) {
      if (result.success) {
        Notification.success({ description: '删除角色成功！', duration: null });
      } else {
        Notification.error({
          description: '删除角色数据异常:' + result.message,
          duration: null
        });
      }
    }
  }));

export default Page1Store;
