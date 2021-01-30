<template>
  <div>
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card>
    <el-row :gutter="20">
        <el-col :span="7">
         <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" class="input-with-select" @clear="goodsList()">
         <el-button slot="append" icon="el-icon-search" @click="goodsList()"></el-button>
  </el-input>
        </el-col>
        <el-col :span="4">
             <el-button type="primary" @click="toAddGoods">添加商品</el-button>
        </el-col>
    </el-row>

        <el-table border stripe
      :data="goodsListData"
      style="width: 100%">
      <el-table-column
        type="index" label="#">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="700">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="100">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="100">
      </el-table-column>
       <el-table-column
        prop="add_time"
        label="创建时间">
        <template slot-scope="scope">
        {{scope.row.add_time| dateFormat}}
        </template>
      </el-table-column>
       <el-table-column
        label="操作">
        <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row.id)"></el-button>
             <el-button size="mini" type="danger" icon="el-icon-delete" @click="showdel(scope.row.goods_id)"></el-button>
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
  </div>
</template>

<script>
export default {
    created(){
      this.goodsList()
    },
data(){
    return{
   queryInfo:{
       query:'',
       pagenum:1,
       pagesize:5
   },
   total:0,
   goodsListData:[]
    }
},
methods:{
   async goodsList(){
     const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
     if(res.meta.status != 200) return this.$message.error('获取商品数组失败')
     console.log(res);
     this.goodsListData = res.data.goods
     this.total = res.data.total
    },
    handleSizeChange(newsize){
     this.queryInfo.pagesize = newsize
     this.goodsList()
    },
    handleCurrentChange(newnum){
     this.queryInfo.pagenum = newnum
     this.goodsList()
    },
    async showdel(id){
        const delfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log(delfirm);
        if(delfirm != 'confirm'){
            return this.$message.info("取消了删除")
        }
        // console.log('删除了');
        const {data:res} = await this.$http.delete('goods/'+id)
        if(res.meta.status !=200 ) return this.$message.error('删除商品失败')
        this.$message.success('删除商品成功')
        this.goodsList()
    },
    toAddGoods(){
        this.$router.push('/goods/addgoods')
    }
}
}
</script>

<style scoped>

</style>