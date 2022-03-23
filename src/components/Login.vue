<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box"><img src="../assets/logo.png" /></div>

      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login_form">
        <!-- 账户 -->
        <el-form-item prop ='username' >
          <!-- 使用阿里图标库  引入指定css等文件 -->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-people" ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-zhanghumima" ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item  class = 'bts'>
          <el-button type="primary" @click='login' >登陆</el-button>
          <el-button type="info" @click='resetLoginForm'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '密码在 5 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
		
		
      this.$refs.loginFormRef.validate(async (valida) => {
        // console.log(valida)
        if (!valida) return
        // await 阻塞http请求,直到其状态变为fulfilled or rejected ,await 只能用在 async 修饰的方法中
        // const result = await this.$http.post('login', this.loginForm)
        // 解构赋值
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.status === 'success') {
          // this.$message({
          //   message: '登陆成功',
          //   center: true,
          //   type: 'success'
          // })
          this.$message.success('登陆成功')
          window.sessionStorage.setItem('token', res.token)
		  window.sessionStorage.setItem('username',this.loginForm.username )
          this.$router.push('/home')
        } 
		else if(res.status === 'expired'){
			this.$message({
			  message: "账户已过期,请联系技术",
			  center: true,
			  type: 'warning'
			})
		}
		else {
          //var msg = res.meta.msg
          this.$message({
            message: "账户或密码错误",
            center: true,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

// 像素需要加px
<style lang="less" scoped>
.login_container {
  background-color: #2b4b2b;
  height: 100%;
}
//绝对定位 先以顶点为基准移动到中位线 再让自身移动自身的50% 以居中
.login_box {
  height: 270px;
  width: 400px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 100px;
    width: 100px;
    border: solid 1px #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

}
//box-sizing 用来调整模型的计算模式 box-sizing: border-box 表明模型width 加了box-sizing:border-box属性，padding和border的值就不会在影响元素的宽高，相当于把padding和border的值都算在content里
.login_form {
  position:absolute;
  bottom: 0px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box
}

.bts{
display: flex;
justify-content: flex-end;
}
</style>
