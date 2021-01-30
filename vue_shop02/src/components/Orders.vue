<template>
  <div>
        <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card>
   <el-row :gutter="20">
        <el-col :span="7">
         <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" class="input-with-select" @clear="goodsList()">
         <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
  </el-input>
        </el-col>
    </el-row>
      <el-table border stripe
      :data="orderlist"
      style="width: 100%">
      <el-table-column
        type="index" label="#">
      </el-table-column>
       <el-table-column
         label="订单编号" prop="order_number">
      </el-table-column>
      <el-table-column
         label="订单价格" prop="order_price">
      </el-table-column>
      <el-table-column
         label="是否付款">
         <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.pay_status == 1">已付款</el-tag>
          <el-tag type="danger"  v-if="scope.row.pay_status == 0">未付款</el-tag>
         </template>
      </el-table-column>
      <el-table-column
         label="是否发货" prop="is_send">
      </el-table-column>
       <el-table-column
         label="下单时间">
         <template slot-scope="scope">
           {{scope.row.create_time | dateFormat}}
         </template>
      </el-table-column>
       <el-table-column
        label="操作">
        <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row.id)"></el-button>
             <el-button size="mini" type="danger" icon="el-icon-delete" @click="showProgress(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
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
  title="修改地址"
  :visible.sync="addressVisible"
  width="30%" @close="addressClose"
  >
<el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="省市区/县" prop="address1">
    <el-cascader 
    v-model="addressForm.address1" clearable
    :options="cityData" 
    :props="cateProps"></el-cascader>
  </el-form-item>
   <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="物流进度"
  :visible.sync="ProgressVisible"
  width="30%"
>
  <span>这是一段信息</span>
 
</el-dialog>

  </div>
</template>

<script>
import cityData from '@/assets/js/citydata.js'
export default {
created(){
this.getOrderList()
},
data(){
  return{
queryInfo:{
  query:'',
  pagenum:1,
  pagesize:5
},
total:0,
orderlist:[],
addressVisible:false,
addressForm:{
address1:[],
address2:'',
},
addressRules:{
 address1:[
    { required: true, message: '请选择省市区县', trigger: 'blur' },
 ],
 address2:[
    { required: true, message: '请填写详细地址', trigger: 'blur' },
 ]

},
cityData,
 cateProps:{
              //  value:'cat_id',
              //  label:'cat_name',
               children:'children',
               expandTrigger:'hover'
           },
ProgressVisible:false,
progressList:[]


  }
},
methods:{
async getOrderList(){
      const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
     if(res.meta.status != 200) return this.$message.error('获取订单失败')
     console.log(res);
     this.orderlist = res.data.goods
     this.total = res.data.total
},
  handleSizeChange(newsize){
     this.queryInfo.pagesize = newsize
     this.getOrderList()
    },
    handleCurrentChange(newnum){
     this.queryInfo.pagenum = newnum
     this.getOrderList()
    },
    showEdit(){
     this.addressVisible = true
    },
    addressClose(){
      this.$refs.addressFormRef.resetFields() 
    },
   async showProgress(){
      // const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      // if(res.meta.status != 200) return this.$message.error('获取物流信息失败')
      //     this.progressList = res.data
      //     console.log(res);
   this.ProgressVisible = true
    }
}
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>