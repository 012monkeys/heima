<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addUserDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item, i) in scope.row.children" :class="['bd-bottom',i === 0 ? 'bd-top': '', 'vcenter']" :key="item.id">
              <!-- 一级属性 -->
              <el-col :span="5" >
                <el-tag closable @close="removeRightById(scope.row,item.id)">
                  {{item.authName}}
                </el-tag >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级属性 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item.children" :key="item2.id" :class="[i2===0? '':'bd-top', 'vcenter']">
                  <el-col :span=6>
                     <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)"> {{item2.authName}} </el-tag>
                     <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span=18>
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)"> {{item3.authName}} </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updataUserById(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-detele" size="mini" @click="removeUsrById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-star-off" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 所有权限 -->
    <el-dialog title="分配权限"  :visible.sync="setRightDialogVisible" width="50%" @close="rightDialogClosed">
      <el-tree :data="rightList" ref="treeRef" :props="rightProps" node-key="id" default-expand-all show-checkbox :default-checked-keys="defaultKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户dialog -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" width="30%" @close="addUserDialogClosed">
      <el-form ref="addUserFormRef" :model="addUserForm" status-icon label-width="70px" :rules="reviseUserRules">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="roleName">
          <el-input v-model="addUserForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addUserForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色权限名称 -->
    <el-dialog title="提示修改用户" :visible.sync="reviseUserDialogVisible" width="30%" @close="reviseUserDialogClosed">
      <el-form ref="reviseUserFormRef" :model="reviseUserForm" status-icon label-width="70px" :rules="reviseUserRules">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="roleName">
          <el-input v-model="reviseUserForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="reviseUserForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviseUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="revieseUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      rightList: [],
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      reviseUserDialogVisible: false,
      addUserDialogVisible: false,
      setRightDialogVisible: false,
      defaultKeys: [], // 默认选择的权限id的数组
      reviseUserForm: '',
      addUserForm: { // tree规则
        roleName: '',
        roleDesc: ''
      },
      roleId: '', // 修改权限用户
      reviseUserRules: {
        // 表单验证规则
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { message: '请输入用户描述', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获得所有的权限列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.rolesList = res.data
      console.log('🚀 ~ file: rights.vue ~ line 26 ~ getRightsList ~ res.data', res.data)
    },
    async removeUsrById(id) {
      // 删除用户弹出确定框
      const confirmResult = await this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      // 像服务器发送删除请求
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('操作失败')
      this.$message.success('删除成功')
      this.getRolesList()
    },
    // 获得修改用户角色信息
    async updataUserById(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('操作失败')
      this.reviseUserForm = res.data
      this.reviseUserDialogVisible = true
    },
    // 对话框关闭的时候, 重置状态
    reviseUserDialogClosed() {
      this.$refs.reviseUserFormRef.resetFields()
    },
    // 修改用户角色信息
    revieseUserInfo(id) {
      this.$refs.reviseUserFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`roles/${this.reviseUserForm.roleId}`, this.reviseUserForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.$message.success('修改用户成功')
        this.reviseUserDialogVisible = false
        this.getRolesList()
      })
    },

    addUserDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 添加用户角色
    addUserInfo() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addUserForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addUserDialogVisible = false
        this.getRolesList()
      })
    },
    // 删除某个权限按钮
    async removeRightById(role, rightId) {
      // 删除用户弹出确定框
      const confirmResult = await this.$confirm('是否删除该用户权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('失败!')
      }
      role.children = res.data
      this.$message.success('删除成功')
    },
    async showSetRightDialog(role) { // 显示所有权限列表
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('失败!')
      }
      this.rightList = res.data
      this.setRightDialogVisible = true
      this._getLeafKeys(role, this.defaultKeys)
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keyStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keyStr })
      if (res.meta.status !== 200) {
        return this.$message.error('失败!')
      }
      this.$message.success('成功!')
      this.getRolesList()
      this.setRightDialogVisible = false
    },

    //  关闭权限对话框
    rightDialogClosed() {
      console.log('dd')
      this.defaultKeys = []
    },
    _getLeafKeys(node, arr) {
      // 递归寻找三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this._getLeafKeys(item, arr)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bd-top{
  border-top: 1px #eee solid;
}
.bd-bottom{
  border-bottom: 1px #eee solid;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
