<template>
  <div class="login-box">
   <div class="login-main">
     <div class="avatar-box">
       <img src="../assets/logo.png" />
     </div>
     <!-- 登入表单区域 -->
     <el-form ref=loginFormRef :model="loginFrom" :rules="rules" label-width="80px" class="login-form">
       <!-- 用户名 -->
       <el-form-item label="用户名" prop="username">
         <el-input v-model="loginFrom.username" prefix-icon="el-icon-user"></el-input>
       </el-form-item>
       <!-- 密码 -->
       <el-form-item label="密码" prop="password">
         <el-input type="password" v-model="loginFrom.password" prefix-icon="el-icon-lock"></el-input>
       </el-form-item>
       <!-- 按钮 -->
       <el-form-item class="btns">
         <el-button type="primary" @click="login">登入</el-button>
         <el-button type="info" @click="resetLoginForm">重置</el-button>
       </el-form-item>
       </el-form>
   </div>
</div>

</template>

<script>
  export default {
    data(){
      return {
        // 这是登入表单的数据对象
        loginFrom:{
          username:'admin',
          password:'123456'
        },
         rules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      // 点击重置按钮,重置登入表单
      resetLoginForm(){
        // console.log(this)
        this.$refs.loginFormRef.resetFields();
      },
      login(){
        this.$refs.loginFormRef.validate(async valid =>{
          console.log(valid)
          if (!valid) return;
           const {data:res} = await this.$http.post("login",this.loginFrom);
           console.log(res);
           if(res.meta.status != 200) return this.$message.error('登入失败')
          this.$message.success('登入成功');
          window.sessionStorage.setItem('token',res.data.token);
          this.$router.push("/home");
        });
      }
    }
  };
</script>

<style scoped>
.login-box{
  height: 100%;
  background-color: #2b4b6b;
}
.login-main{
  width: 450px;
  height: 300px;
  border-radius: 3px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.login-main .avatar-box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0  0 10px #ddd;
 position: absolute;
 left: 50%;
 transform: translate(-50%,-50%);
background-color: #fff;
}
.login-main .avatar-box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #eee;
}
.login-form{
  position: absolute;
  bottom: 0;
  width: 90%;
}
.btns{
  display: flex;
  justify-content:center;
}
</style>

