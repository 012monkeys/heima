<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" />
      </div>
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
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
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
        password: '123456'
      },
      loginFormRules: { // 表单验证规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm(e) { // 重置表单内容
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 登陆验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginform)
        if (res.meta.status !== 200) {
          this.$message.error('登陆失败')
          return
        }
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token) // 存储在sessionStorage
        this.$router.push('/home')
      })
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
    bottom: 40px;
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
