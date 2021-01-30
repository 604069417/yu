<template>
  <div>
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card>
    <el-row :gutter="20">
    <el-col :span="7">
     <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getuserList()">
    <el-button slot="append" icon="el-icon-search" @click="getuserList()"></el-button>
  </el-input>
    </el-col>
    <el-col :span="4">
     <el-button type="primary" @click="openadddialog">添加用户</el-button>
    </el-col>
</el-row>
     <el-table  :data="userList" stripe border
      style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
          <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userstatus(scope.row)"></el-switch>
          </template>
      </el-table-column>
      <el-table-column label="操作">
           <template slot-scope="scope">
             <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row.id)"></el-button>
             <el-button size="mini" type="danger" icon="el-icon-delete" @click="showdel(scope.row.id)"></el-button>
              <el-tooltip effect="dark" content="修改" placement="top" :enterable='false'>
                  <el-button size="mini" type="warning" icon="el-icon-setting" @click="setrole(scope.row)"></el-button>
        </el-tooltip>
          </template>
      </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<el-dialog
  title="添加用户"
  :visible.sync="adddialog"
  width="30%" :close-on-click-modal="false" @close="addclosedialog">
  <el-form :model="addForm" :rules="addformrules" ref="addformref" 
  label-width="70px">
  <el-form-item label="姓名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialog = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="修改用户信息"
  :visible.sync="editdialog"
  :close-on-click-modal="false"
  width="30%" @close="editclose">
 <el-form :model="editform" :rules="editformrules" ref="editformref" 
  label-width="70px">
  <el-form-item label="用户名">
    <el-input v-model="editform.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editform.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editform.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialog = false">取 消</el-button>
    <el-button type="primary" @click="edituser">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="修改角色"
  :visible.sync="setRoleDialogVisible"
  :close-on-click-modal="false"
  width="30%" @close="setRoleDialogClosed">
  <div>
    <p>当前的用户：{{userInfo.username}}</p>
    <p>当前的角色：{{userInfo.role_name}}</p>
    <p>选择新的角色：<el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    created(){
       this.getuserList()
    },
data(){
    // 验证规则
    var checkEmail = (rule,value,cb) => {
        // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
          return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    var checkMobile = (rule,value,cb) => {
        // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)){
          return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return{
      queryInfo:{
          query:'',
          pagenum:1,
          pagesize:2
      },
       userList:[],
       total:0,
       adddialog:false,
       addForm:{
           username:'',
           password:'',
           email:'',
           mobile:''
       },
       addformrules:{
           username:[
                { required: true, message: '请输入正确的用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
           ],
           password:[
                { required: true, message: '请输入正确的密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
           ],
            email:[
                { required: true, message: '请输入正确的邮箱', trigger: 'blur' },
                 { validator: checkEmail, trigger: 'blur' }
           ],
            mobile:[
                { required: true, message: '请输入正确的手机号码', trigger: 'blur' },
                 { validator: checkMobile, trigger: 'blur' }
           ]
       },
       editdialog: false,
       editform:{},
       editformrules:{
            email:[
                { required: true, message: '请输入正确的邮箱', trigger: 'blur' },
                 { validator: checkEmail, trigger: 'blur' }
           ],
            mobile:[
                { required: true, message: '请输入正确的手机号码', trigger: 'blur' },
                 { validator: checkMobile, trigger: 'blur' }
           ]
       },
       setRoleDialogVisible:false,
       userInfo:{},
       rolesList:[],
       selectedRoleId:''
       
    }
   
},
methods:{
  async  getuserList(){
      const {data : res} = await this.$http.get('users',{params:this.queryInfo})
    //   console.log(res);
      if(res.meta.status != 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
        //  console.log(this.userList);
    },
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize
      this.getuserList()
    },
    handleCurrentChange(newpage){
     this.queryInfo.pagenum = newpage
      this.getuserList()
    },
    async userstatus(userinfo){
     const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
     if(res.meta.status !=200){
         userinfo.mg_state = !userinfo.mg_state
         return this.$message.error('更新信息失败')
     }
         this.$message.success('更新信息成功')

    },
    openadddialog(){
        this.adddialog = true
    },
    addclosedialog(){
        this.$refs.addformref.resetFields()
    },
    adduser(){
        this.$refs.addformref.validate(async valid => {
            if(!valid) return
           const {data:res} = await this.$http.post('users',this.addForm)
      if(res.meta.status != 201) return this.$message.error('添加用户列表失败')
             this.$message.success('添加用户列表成功')
             this.adddialog = false
             this.getuserList()
        })
    },
    async showEdit(id){
     const {data:res} = await this.$http.get(`users/`+id)
    if(res.meta.status !=200) return this.$message.error('获取信息失败')
       this.editform = res.data
      this.editdialog = true
    //   console.log(id);
    } ,
    edituser(){
      this.$refs.editformref.validate(async valid => {
            if(!valid) return
           const {data:res} = await this.$http.put('users/' + this.editform.id,{
               email:this.editform.email,
               mobile:this.editform.mobile
               })
      if(res.meta.status != 200) return this.$message.error('修改用户列表失败')
             this.$message.success('修改用户列表成功')
             this.editdialog = false
             this.getuserList()
        })
    },
    editclose(){
        this.$refs.editformref.resetFields()
    },
   async showdel(id){
      // console.log(id);
    const confir =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
         if(confir !== 'confirm'){
           return this.$message.info('已取消删除')
         }
        const {data:res} = await this.$http.delete('users/'+id)
        if(res.meta.status != 200) return this.$message.error('删除用户失败')
        this.$message.success('删除用户成功')
       this.queryInfo.pagenum = 1
        this.getuserList()
    },
    async setrole(userInfo){
      this.userInfo = userInfo
       const {data:res} = await this.$http.get('roles')
       if(res.meta.status != 200) return this.$message.error('获取角色列表失败')
       console.log(res);
       this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
       // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
       console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      this.getuserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
}
}
</script>

<style scoped>


</style>