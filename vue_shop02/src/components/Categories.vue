<template>
  <div>
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>

   <el-card>
       <el-row>
       <el-col>
       <el-button type="primary" @click="addCateDialog">添加分类</el-button>
       </el-col>
   </el-row>
    <tree-table class="tree-bable"
    :data="cateList"
    :columns="columns"
    :selection-type="false"
    :expand-type="false"
    show-index
    index-text='#'
    border>
    <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted === false"></i>
        <i class="el-icon-error" style="color:lightgreen" v-else></i>
    </template>
    <template slot="order" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level ===0">一级</el-tag>
        <el-tag v-if="scope.row.cat_level ===1" type="success">二级</el-tag>
        <el-tag v-if="scope.row.cat_level ===2" type="info">三级</el-tag>
    </template>
     <template slot="opt" slot-scope="scope">
    <el-button size="mini" type="primary" icon="el-icon-edit" @click="editCate(scope.row.cat_id)">编辑</el-button>
    <el-button size="mini" type="danger" icon="el-icon-delete" @click="delCate(scope.row.cat_id)">删除</el-button>
    </template>
    </tree-table>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   </el-card>


   <el-dialog
  title="添加分类"
  :visible.sync="addCate" @close="cateClose"
  width="30%" :close-on-click-modal="false">
<el-form :model="cateForm" :rules="cateRules" ref="cateFormref" 
  label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="cateForm.cat_name" ></el-input>
  </el-form-item>
   <el-form-item label="父级分类">
       <el-cascader style="width:100%"
    v-model="selectedKeys" clearable
    :options="parentCateList" @change="parentCateChanged"
    :props="cascaderProps"></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCate = false">取 消</el-button>
    <el-button type="primary" @click="addCateInfo">确 定</el-button>
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
           queryInfo:{
               type:3,
               pagenum:1,
               pagesize:5
           },
           total:0,
           columns:[
               {
                   label:"分类名称",
                   prop:'cat_name'
               },
               {
                   label:"是否有效",
                   type:'template',
                   template:"isok"
               },
                {
                   label:"排序",
                   type:'template',
                   template:"order"
               },
                {
                   label:"操作",
                   type:'template',
                   template:"opt"
               }
           ],
           addCate:false,
           cateForm:{
               cat_name:'',
               cat_pid:0,
               cat_level:0
           },
           cateRules:{
               cat_name:[
                    { required: true, message: '请输入正确的用户名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
               ]
           },
           parentCateList:[],
           cascaderProps:{
               value:'cat_id',
               label:'cat_name',
               children:'children',
               expandTrigger:'hover',
               checkStrictly:true
           },
           selectedKeys:[]
        }
    },
    methods:{
      async  getCateList(){
          const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
        //   console.log(res);
          if(res.meta.status != 200) return this.$message.error('获取商品分类列表失败');
          this.cateList = res.data.result
          this.total = res.data.total
        },
        handleSizeChange(newSize){
           this.queryInfo.pagesize = newSize
           this.getCateList()
        },
        handleCurrentChange(newNum){
         this.queryInfo.pagenum = newNum
          this.getCateList()
        },
        addCateDialog(){
            this.getParentCateList()
          this.addCate = true
        },
       async getParentCateList(){
         const {data:res} = await this.$http.get('categories',{params:{type:2}})
          if(res.meta.status != 200) return this.$message.error('获取父级分类列表失败');
        //    console.log(res);
           this.parentCateList = res.data
        },
        parentCateChanged(){
        //  console.log(this.selectedKeys);
        if(this.selectedKeys.length>0){
            this.cateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
            // console.log(this.cateForm.cat_pid);
             this.cateForm.cat_level = this.selectedKeys.length
             return
        }else{
             this.cateForm.cat_pid = 0
             this.cateForm.cat_level = 0
        }
        },
        addCateInfo(){
            //  console.log(this.cateForm);
            this.$refs.cateFormref.validate(async valid => {
            if(!valid) return
           const {data:res} = await this.$http.post('categories',this.cateForm)
           console.log(res);
      if(res.meta.status != 201) return this.$message.error('修改用户列表失败')
             this.$message.success('修改用户列表成功')
             this.addCate = false
             this.getCateList()
        })
        },
        cateClose(){
            this.$refs.cateFormref.resetFields() 
            this.selectedKeys = []
            this.cateForm.cat_pid = 0
             this.cateForm.cat_level = 0
        },
        editCate(id){

        },
        delCate(id){

        }
    }
}
</script>

<style scoped>
.tree-bable{
    margin-top: 15px;
}
</style>