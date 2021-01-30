<template>
  <el-container class="home-con">
      <!-- 头部 -->
  <el-header>

      <div @click="goHome">
           <img src="../assets/logo.png"/>
          <p>电商管理系统</p>
      </div>
    
      <el-button type="info" plain @click="logout" size="mini">退出</el-button>
  </el-header>
  <el-container>
      <!-- 左侧 -->
    <el-aside :width="iscollapse?'64px':'200px'">
        <el-menu background-color="#333744" active-text-color="#409EFF"
         text-color="#fff" 
         unique-opened
         router
         :collapse="iscollapse"
         :collapse-transition='false'
         :default-active='activePath'
         >
         <div class="toggle-button" @click="toggleCollapse()">|||</div>
            <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key='item.id'>
          <!-- 一级菜单模板区域 -->
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/' +item2.path" @click="saveNavState('/' +item2.path)" v-for="item2 in item.children" :key='item2.id'>
             <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{item2.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧 -->
    <el-main>
        <router-view/>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
    data(){
        return{
        menulist:[],
        iscollapse:false,
        activePath:''
        }
    },
  name:'home',
  created(){
     this.getMenuList(),
     this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods:{
      logout(){
          window.sessionStorage.clear();
          this.$router.push("/login")
          return this.$message.warning('退出成功')
      },
     async getMenuList(){
          const {data: res} = await this.$http.get('menus')
        //   console.log(res);
        if(res.meta.status !== 200) return this.$message.error('获取数据失败');
          this.menulist = res.data
        //   console.log(this.menulist);
      },
      toggleCollapse(){
        this.iscollapse = !this.iscollapse
      },
      saveNavState(activePath){
       window.sessionStorage.setItem('activePath',activePath)
       this.activePath = activePath
      },
      goHome(){
        this.$router.push("/welcome")
      }
  }
}
</script>

<style>
.home-con{
    height: 100%;
}
.el-header{
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.el-header div{
    display: flex;
    align-items: center;
    cursor: pointer;
}
.el-header p{
    font-size: 25px;
    margin:0px 30px;
    color: #fff;
    
}
.el-header img{
    widows: 40px;
    height: 40px;
    border: 3px solid #fff;
    border-radius: 50%;
}
.el-aside{
    background: #333744;
}
.el-main{
    background: #EAEDF1;
}
.el-aside .el-menu{
    border-right: none;
}
.toggle-button{
    text-align: center;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    line-height: 24px;
    background: #4a5064;
    letter-spacing: 0.2em;
}
</style>