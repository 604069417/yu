<template>
  <div>
         <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card>
   <el-row>
       <el-col>
       <el-button type="primary" @click="openaddrole">添加角色</el-button>
       </el-col>
   </el-row>
       <el-table
      :data="roleslist"
      style="width: 100%" border stripe>
      <el-table-column type="expand">
         <template slot-scope="scope">
             <el-row :class="['bdbottom','vcenter', index ==0? 'bdtop':'']" v-for="(item,index) in scope.row.children" :key="item.id">
                 <el-col :span="5">
                     <el-tag  @close="removerbtn(scope.row,item.id)" closable>{{item.authName}}</el-tag>
                     <i class="el-icon-caret-right"></i>
                 </el-col>
                 <el-col :span="19">
                     <el-row v-for="(item2,index) in item.children" :key="item2.id" :class="['vcenter',index ==0? '':'bdtop']">
                         <el-col :span="6" >
                              <el-tag type="success" @close="removerbtn(scope.row,item2.id)"  closable>{{item2.authName}}</el-tag>
                               <i class="el-icon-caret-right"></i>
                         </el-col>
                         <el-col :span="18">
                             <el-tag type="info" @close="removerbtn(scope.row,item3.id)" closable v-for="(item3,index) in item2.children" :class="[index ==0? '':'bdtop']" :key="item3.id">{{item3.authName}}</el-tag>
                         </el-col>
                     </el-row>
                 </el-col>
             </el-row>
           
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#"></el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        >
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        >
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row.id)">修改</el-button>
             <el-button size="mini" type="danger" icon="el-icon-delete" @click="showdel(scope.row.id)">删除</el-button>
                  <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-card>

<el-dialog
  title="添加角色信息"
  :visible.sync="addrole"
  :close-on-click-modal="false"
  width="35%" @close="closeroles">
 <el-form :model="rolesForm" :rules="rolesrules" ref="rolesFormref" 
  label-width="100px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="rolesForm.roleName" ></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="rolesForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addrole = false">取 消</el-button>
    <el-button type="primary" @click="addroleuser">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="修改角色信息"
  :visible.sync="editrole"
  :close-on-click-modal="false"
  width="35%" @close="closeeditroles">
 <el-form :model="editrolesForm" :rules="editrolesrules" ref="editrolesFormref" 
  label-width="100px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editrolesForm.roleName" ></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editrolesForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editrole = false">取 消</el-button>
    <el-button type="primary" @click="editroleuser">确 定</el-button>
  </span>
</el-dialog>

<el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    created(){
     this.getroleslist()
    }, 
    data(){
        return{
            roleslist:[],
            addrole:false,
            rolesForm:{
                roleName:'',
                roleDesc:''
            },
            rolesrules:{
           roleName:[
                { required: true, message: '请输入正确的用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
           ],
           roleDesc:[
                { required: true, message: '请输入正确的密码', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
           ]
       },
       editrole:false,
       editrolesForm:{},
        editrolesrules:{
           roleName:[
                { required: true, message: '请输入正确的用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
           ],
           roleDesc:[
                { required: true, message: '请输入正确的密码', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
           ]
       },
       // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''

        }
    },
    methods:{
        async getroleslist(){
           const {data:res} = await this.$http.get('roles')
            //  console.log(res);
             if(res.meta.status != 200) return this. $messae('获取角色列表失败')
             this.roleslist = res.data
        },
       async removerbtn(role,rightid){
            // console.log(id);
          const delfir= await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(delfir !== 'confirm'){
           return this.$message.info('已取消删除')
         }
          const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
          if(res.meta.status != 200) return this.$message.error('删除角色失败')
          role.children = res.data
          this.$message.success('删除角色成功')
        },
        openaddrole(){
            this.addrole = true
        },
        closeroles(){
            this.$refs.rolesFormref.resetFields()    
        },
        addroleuser(){
         this.$refs.rolesFormref.validate(async valid => {
            if(!valid) return
           const {data:res} = await this.$http.post('roles',this.rolesForm)
      if(res.meta.status != 201) return this.$message.error('添加用户列表失败')
             this.$message.success('添加用户列表成功')
             this.addrole = false
             this.getroleslist()
        })
        },
        async showEdit(id){
           this.editrole = true
          const {data:res} = await this.$http.get('roles/'+id)
          if(res.meta.status != 200) return this.$message.error('获取信息失败')
          this.editrolesForm = res.data
          console.log(this.editrolesForm);
        },
        closeeditroles(){
            this.$refs.editrolesFormref.resetFields()    
        },
       async editroleuser(){
             this.$refs.editrolesFormref.validate(async valid => {
            if(!valid) return
           const {data:res} = await this.$http.put('roles/'+this.editrolesForm.roleId,{
               roleName:this.editrolesForm.roleName,
               roleDesc:this.editrolesForm.roleDesc
           })
           console.log(res);
      if(res.meta.status != 200) return this.$message.error('修改用户列表失败')
             this.$message.success('修改用户列表成功')
             this.editrole = false
             this.getroleslist()
        })
        },
       async showdel(id){
          const delrole = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
           if(delrole != 'confirm'){
               return this.$message.info('取消删除角色')
           }
           const {data:res} = await this.$http.delete('roles/'+id)
           if(res.meta.status != 200) return this.$message.error('删除角色事变')
           this.$message.success('删除角色成功')
           this.getroleslist()
        },
  // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }

      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      console.log(this.rightslist)

      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getroleslist()
      this.setRightDialogVisible = false
    }

    }

}
</script>

<style scoped>
  .el-tag{
      margin:7px ;
  }
  .bdtop{
      border-top: 1px solid #eee;
  }
  .bdbottom{
      border-bottom: 1px solid #eee;
  }
  .vcenter{
      display: flex;
      align-items: center;
  }
</style>