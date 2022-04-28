<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" class="login-form" :model="loginform" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input class="form-input" v-model="loginform.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input class="form-input" v-model="loginform.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item class="btns form-input">
          <el-button type="primary" @click="login" :loading="loading">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
        <el-form-item class="btns">
          <el-checkbox-group v-model="loginform.role" :min="0" :max="1">
            <el-checkbox v-for="(role,index) in roles" :label="role" :key="index">{{role}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginform: {
        username: 'admin',
        password: '123456',
        role: ['edit']
      },
      roles: ['edit', 'admin'],
      loginFormRules: { // 表单验证规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      },
      loading: false // 登陆按钮状态
    }
  },
  watch: {
    $route: { // 获得路由重定向的路由路径和查询参数
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    resetLoginForm(e) { // 重置表单内容
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 登陆验证
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return // 验证失败,返回
        this.loading = true
        this.$store.dispatch('login', this.loginform).then(() => {
          this.loading = false
          this.$store.commit('SET_FAKE_ROLES', this.loginform.role)
          console.log('🚀 ~ this.$store.dispatch ~ this.loginform', this.loginform)
          this.$message.success('登陆成功')

          // 传入重定向和查询参数
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    getOtherQuery(query) { // 取出查询参数
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar-box {
    width: 130px;
    height: 130px;
    padding: 10px;
    border-radius: 50%;
    border: 1px solid #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
    }
  }
  .login-form {
    box-sizing: border-box;
    padding: 0 20px;
    position: absolute;
    bottom: 20px;
    width: 100%;
    .form-input {
      margin-bottom: 0px;
    }
  }
  .btns {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
