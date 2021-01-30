<template>
  <div>
        <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
     <el-card>
         <el-alert
    title="添加商品信息"
    type="info"
    center :closable='false'
    show-icon>
  </el-alert>
  <div class="steps">    
      <!-- :active="activeIndex - 0" 中的activeIndex只接收数字类型的值，所以用隐式转换变成数字类型的值 -->
       <el-steps  align-center :space="200" :active="activeIndex - 0" finish-status="success">
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
  </div>
  <!--  v-model='activeIndex'  这里接收的是字符类型的值，定义的时候就是字符类型的值，不用转换-->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
   <el-tabs @tab-click="tabClicked" :tab-position="tabPosition" v-model='activeIndex' :before-leave="beforeTabLeave">
    <el-tab-pane label="用户管理" name="0">
      <el-form-item label="商品名称" prop="goods_name">
       <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
       <el-form-item label="商品价格" prop="goods_price">
         <!-- type="number"  在el-input框设置type类型后只能输入数字 -->
       <el-input v-model="addForm.goods_price" type="number"></el-input> 
      </el-form-item>
       <el-form-item label="商品重量" prop="goods_weight">
       <el-input v-model="addForm.goods_weight" type="number"></el-input>
      </el-form-item>
       <el-form-item label="商品数量" prop="goods_number">
       <el-input v-model="addForm.goods_number" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="goods_cat">
        <el-cascader style="width:260px"
    v-model="addForm.goods_cat" clearable
    :options="cateList" @change="handleChange"
    :props="cateProps"></el-cascader>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
       <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
          <el-checkbox-group v-model="item.attr_vals">
          <el-checkbox border :label="item2" v-for="(item2,index) in item.attr_vals" :key="index"></el-checkbox>
  </el-checkbox-group>
       </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
      <el-form-item :label="item.attr_name" v-for = "item in onlyTabData" :key="item.attr_id">
        <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
       <!-- 上传到的后台api地址 -->
      <el-upload
  :action="uploadUrl"
  :on-preview="handlePreview" :on-success="handleSuccess"
  :on-remove="handleRemove" :headers="headerObj"
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
       <quill-editor v-model="addForm.goods_introduce"
  />
      <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
  </el-form>
     </el-card>
     <el-dialog
  title="图片预览" 
  :visible.sync="previewOpen"
  width="30%">
    <img :src="previewImg" alt="" srcset="" class="prevImg">
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  created(){
   this.getCateList()
  },
 data(){
     return{
         activeIndex:'0',
         tabPosition:'left',
         addForm:{
           goods_name:'',
           goods_price:0,
           goods_weight:0,
           goods_number:0,
           goods_cat:[],
           pics:[],
           goods_introduce:'',
           attrs:[]
         },
         addFormRules:{
           goods_name:[
              { required: true, message: '请输入商品名称', trigger: 'blur' },
              { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
           ],
           goods_price:[
             { required: true, message: '请输入商品价格', trigger: 'blur' },
              { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
           ],
           goods_weight:[
             { required: true, message: '请输入商品重量', trigger: 'blur' },
              { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
           ],
           goods_number:[
             { required: true, message: '请输入商品数量', trigger: 'blur' },
              { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
           ],
           goods_cat:[
             { required: true, message: '请输入商品分类', trigger: 'blur' }
           ]

         },
         cateList:[],
          cateProps:{
               value:'cat_id',
               label:'cat_name',
               children:'children',
               expandTrigger:'hover'
           },
           manyTabData:[],
           onlyTabData:[],
           uploadUrl:'http://www.ysqorz.top:8888/api/private/v1/upload',
           headerObj:{
             Authorization:window.sessionStorage.getItem('token')
           },
           previewImg:'',
           previewOpen:false
     }
 },
 methods:{
   handleChange(){
   this.getParamsData()
   },
   async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status != 200 ) return this.$message.error('获取分类失败');
      this.cateList = res.data
      // console.log(res);
   },
     async  getParamsData(){
           if(this.addForm.goods_cat.length !== 3){
               this.addForm.goods_cat = []
               return
           }

         },
         beforeTabLeave(activeName, oldActiveName){
                if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                  this.$message.error('请先选择分类');
                  return false
                }
         },
        async tabClicked(){
           if(this.activeIndex === '1'){
             const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
             {params:{sel:'many'}})
              if(res.meta.status != 200 ) return this.$message.error('获取参数失败');
                res.data.forEach(item => {
                  item.attr_vals = 
                  item.attr_vals.length === 0 ?
                  []:item.attr_vals.split(' ')
                })
             this.manyTabData = res.data
              // console.log(res);
           }else if(this.activeIndex === '2'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
             {params:{sel:'only'}})
              if(res.meta.status != 200 ) return this.$message.error('获取参数失败');
              this.onlyTabData = res.data
              
           }
         },
         handlePreview(file){
          this.previewImg = file.url
          console.log(file);
          this.previewOpen = true
         },
         handleRemove(file){
          const filePath = file.response.data.tmp_path
          const i = this.addForm.pics.findIndex(x => x.pic === filePath)
          this.addForm.pics.splice(i,1)
          console.log(this.addForm);
         },
         handleSuccess(response){
             console.log(response);
            //  拼接得到一个图片的信息对象
           const picInfo = {pic: response.data.tmp_path}

          //  将图片信息对象，push到pic数组中
          this.addForm.pics.push(picInfo)
          console.log(this.addForm);
         },
        add(){
           this.$refs.addFormRef.validate(async valid =>{
             if(!valid){
               return this.$message.error('请填写必要的表单项')
             }
             const form = _.cloneDeep(this.addForm)
              form.goods_cat = form.goods_cat.join(',')
            //  动态参数的处理
             this.manyTabData.forEach(item => {
               const newInfo = {
                 attr_id:item.attr_id,
                 attr_vals:item.attr_vals.join(' ')
               }
               this.addForm.attrs.push(newInfo)
             })
            //  静态参数的处理
             this.onlyTabData.forEach(item => {
               const newInfo = {
                 attr_id:item.attr_id,
                 attr_vals:item.attr_vals
               }
               this.addForm.attrs.push(newInfo)
             })
             form.attrs = this.addForm.attrs
             console.log(form);

           const {data:res} = await this.$http.post('goods',form)
            if(res.meta.status != 201 ) return this.$message.error('获取参数失败');
            this.$message.success('获取参数成功');
            this.$router.push('/goods')
           })
         }
 },
 computed:{
   cateId(){
     if(this.addForm.goods_cat.length === 3){
       return this.addForm.goods_cat[2]
     }
     return null
   }
 }
}
</script>

<style scoped>
.steps{
  margin-top:20px;
}
.el-step__title{
    font-size:13px !important;
}
.el-tabs{
    margin-top: 15px;
}
.el-form-item{
  width: 800px;
  margin-left: 100px;
}
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.prevImg{
  width: 100%;
  height: 200px;
}
.quill-editor{
  width: 800px;
  margin-left: 20px;
}
.ql-container{
  height: 200px !important;
}
.addBtn{
  margin-top: 20px !important;
  margin-left: 20px !important;
}
</style>