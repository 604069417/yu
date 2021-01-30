<template>
  <div>
       <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card>
    <el-table
      :data="rightslist"
      style="width: 100%" border stripe>
       <el-table-column type="index"  label="#">
      </el-table-column>
      <el-table-column
        prop="id"
        label="id"
       >
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限列表"
       >
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        >
      </el-table-column>
      <el-table-column
        label="权限等级">
       <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.level === '0'">等级一</el-tag>
        <el-tag type="info" v-if="scope.row.level === '1'">等级二</el-tag>
        <el-tag type="danger" v-if="scope.row.level === '2'">等级三</el-tag>
       </template>
      </el-table-column>
    </el-table>
    
</el-card>
  </div>
</template>

<script>
export default {
    created(){
    this.getrightslist()
    },
    data(){
        return{
          rightslist:[]
        }
    },
    methods:{
       async getrightslist(){
         const {data:res} = await this.$http.get('rights/list')
         console.log(res);
         if(res.meta.status != 200) return this.$message.error('获取权限列表数据失败')
         this.rightslist = res.data
       }
    }
}
</script>

<style>

</style>