<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
             <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="removeUsrById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="添加角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-star-off" circle @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" status-icon :rules="addFormRules" label-width="70px">
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名">
          <el-input class="form-input" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input class="form-input" v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input class="form-input" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input class="form-input" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="提示修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" status-icon :rules="editFormRules" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
     <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的用户: {{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savaRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    const checkEmail = (rule, value, cb) => {
      // 邮箱正则表达式
      const regEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确邮箱'))
    }
    const checkMobile = (rule, value, cb) => {
      // 手机正则表达式
      const regMobile = /^1[0-9]{10}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确手机号'))
    }
    return {
      queryInfo: {
        // 查询用户对象
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      rolesList: [],
      userInfo: {},
      selectedRoleId: null,
      addForm: {
        // 新建用户对象
        username: '',
        password: '',
        email: '156@163.com',
        mobile: '12345679101'
      },
      editForm: {

      },
      addFormRules: {
        // 表单验证规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 获得用户列表数据
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 当前页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 选择页码值改变
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage
      this.getUserList()
    },
    // 监听switch状态
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        this.queryInfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
    },
    // 用户对话框关闭时
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 确定添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置编辑用户表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户成功')
      })
    },
    // 删除用户
    async removeUsrById(id) {
      const confirmResult = await this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除!'
        })
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: '删除失败'
        })
      }
      this.$message.success('删除成功')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo

      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户失败')
      }

      this.rolesList = res.data
      // 在展示对话框之前, 获得所有角色的列表
      this.setRoleDialogVisible = true
    },
    // 保存分配的角色
    async savaRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) {
        return this.$message.error('失败')
      }
      this.$message.success('更新成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 关闭权限分配对话框的重置参数
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
