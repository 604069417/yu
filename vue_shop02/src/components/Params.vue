<template>
  <div>
       <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>分类参数</el-breadcrumb-item>
</el-breadcrumb>

   <el-card>
       <el-alert
    title="注意：只允许第三级分类设置相关参数！"
    type="warning" show-icon :closable="false">
  </el-alert>

    <el-row class="cat_opt">
       <el-col>
        <span>选择商品分类:</span>
          <el-cascader style="width:260px"
    v-model="selectedKeys" clearable
    :options="cateList" @change="parentCateChanged"
    :props="cateProps"></el-cascader>
       </el-col>
   </el-row>
    <el-tabs v-model="selectedTab" @tab-click="handTabClick">
    <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="openAddDialog">添加参数</el-button>
      <el-table  :data="manyTableData" stripe border
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
         <el-tag closable v-for="(itemvals,index) in scope.row.attr_vals" :key="index" @close="tagClose(index,scope.row)">{{itemvals}}</el-tag>
         <el-input
          class="input-new-tag" style="width:120px" 
          v-if="scope.row.inputVisible"
          v-model="scope.row.inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm(scope.row)"
          @blur="handleInputConfirm(scope.row)"
        >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
           <template slot-scope="scope">
             <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row.attr_id)">修改</el-button>
             <el-button size="mini" type="danger" icon="el-icon-delete" @click="showdel(scope.row.attr_id)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态绑定" name="only">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="openAddDialog">添加属性</el-button>
         <el-table  :data="onlyTableData" stripe border
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
         <el-tag closable v-for="(itemvals,index) in scope.row.attr_vals" :key="index" @close="tagClose(index,scope.row)">{{itemvals}}</el-tag>
         <el-input
          class="input-new-tag" style="width:120px" 
          v-if="scope.row.inputVisible"
          v-model="scope.row.inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm(scope.row)"
          @blur="handleInputConfirm(scope.row)"
        >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="属性名称" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
           <template slot-scope="scope">
             <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row.attr_id)">修改</el-button>
             <el-button size="mini" type="danger" icon="el-icon-delete" @click="showdel(scope.row.attr_id)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    </el-tab-pane>
  </el-tabs>
   </el-card>
   <el-dialog
  :title="'添加'+trigger"
  :visible.sync="addParams"
  width="30%" @close="addDialogCloae"
  >
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label="trigger" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addParams = false">取 消</el-button>
    <el-button type="primary" @click="AddParams">确 定</el-button>
  </span>
</el-dialog>

   <el-dialog
  :title="'修改'+trigger"
  :visible.sync="editParams"
  width="30%" @close="editDialogCloae"
  >
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="名称" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editParams = false">取 消</el-button>
    <el-button type="primary" @click="EditParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
     created(){
        this.getCateList()
     },
     data(){
         return{
            cateList:[],
            cateProps:{
               value:'cat_id',
               label:'cat_name',
               children:'children',
               expandTrigger:'hover'
           },
           selectedKeys:[],
           selectedTab:'many',
           manyTableData:[],
           onlyTableData:[],
           addParams:false,
           addForm:{
               attr_name:''
           },
           addFormRules:{
               attr_name:[
                    { required: true, message: '请输入正确的内容', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
               ]
           },
           editParams:false,
           editForm:{
             attr_name:''
           },
            editFormRules:{
               attr_name:[
                    { required: true, message: '请输入正确的内容', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
               ]
           },

         }
     },
     methods:{
        async getCateList(){
              const {data:res} = await this.$http.get('categories')
        //    console.log(res);
      if(res.meta.status != 200) return this.$message.error('修改用户列表失败')
              this.cateList = res.data
         },
         parentCateChanged(){
          this.getParamsData()
         },
         handTabClick(){
             this.getParamsData()
         },
       async  getParamsData(){
           if(this.selectedKeys.length !== 3){
               this.selectedKeys = []
               this.manyTableData = []
               this.onlyTableData = []
               return
           }
          const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.selectedTab}})
          if(res.meta.status != 200) return this.$message.error('获取参数列表失败')
         
          res.data.forEach(item =>{
           item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
            
          })
          //  console.log(res);
          //  console.log(item);
           if(this.selectedTab == 'many'){
               this.manyTableData = res.data
           }else{
               this.onlyTableData= res.data
           }
         },
         openAddDialog(){
             this.addParams = true
         },
         addDialogCloae(){
             this.$refs.addFormRef.resetFields() 
         },
         AddParams(){
           this.$refs.addFormRef.validate(async valid => {
             if(!valid) return
             const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
               attr_name:this.addForm.attr_name,
               attr_sel:this.selectedTab
             })
          // console.log(res);
          if(res.meta.status != 201) return this.$message.error('添加失败');
          this.$message.success("添加成功")
          this.addParams = false
          this.getParamsData()
           })
         },
        async showEdit(id){
          const {data:res} =  await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
            params:{attr_sel:this.selectedTab}
          })
          // console.log(res);
          if(res.meta.status != 200) return this.$message.error('获取信息错误')
          this.editForm = res.data
           this.editParams = true
         },
          editDialogCloae(){
             this.$refs.editFormRef.resetFields() 
         },
         EditParams(){
              this.$refs.editFormRef.validate(async valid => {
             if(!valid) return
             const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
               attr_name:this.editForm.attr_name,
               attr_sel:this.selectedTab
             })
          // console.log(res);
          if(res.meta.status != 200) return this.$message.error('修改失败');
          this.$message.success("修改成功")
          this.editParams = false
          this.getParamsData()
           })
         },
         async showdel(id){
          const delfir= await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(delfir !== 'confirm'){
           return this.$message.info('已取消删除')
         }
          const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
          if(res.meta.status != 200) return this.$message.error('删除角色失败')
          this.$message.success('删除角色成功')
            this.getParamsData()
         },
       async handleInputConfirm(row){
          //  没有输入内容
           if(row.inputValue.trim().length === 0){
            //  console.log(1);
             row.inputValue = ''
            row.inputVisible = false
            return
           }
          //  有输入内容
          if(row.inputValue === ''){
             row.inputValue = ''
            row.inputVisible = false
            return
          }
          row.attr_vals.push(row.inputValue.trim())
          row.inputValue = ''
          row.inputVisible = false
       this.saveAttrVals(row)
         },
        async saveAttrVals(row){
         // 发起请求
         const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
           attr_name:row.attr_name,
           attr_sel:row.attr_sel,
           attr_vals:row.attr_vals.join(' ')
         })
         console.log(res);
          if(res.meta.status != 200) return this.$message.error('添加属性失败')
          this.$message.success('修改属性成功')
         },
         showInput(row){
           row.inputVisible = true
          this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
         },
          tagClose(index,row){
            row.attr_vals.splice(index,1)
           this.saveAttrVals(row)
         }
     },
     computed:{
         isBtnDisabled(){
             if(this.selectedKeys.length !==3){
                 return true
             }
             return false
         },
         cateId(){
             if(this.selectedKeys.length == 3){
                 return this.selectedKeys[2]
             }
             return null
         },
         trigger(){
               if(this.selectedTab == 'many'){
               return '动态参数'
           }else{
               return '静态属性'
           }
         }
     }
}
</script>

<style scoped>
.cat_opt{
    margin: 15px 0;
}
.el-tag{
  margin-right: 20px;
}

</style>