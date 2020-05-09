<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <!--搜索-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" clearable @clear="getProductList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getProductList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goaddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--列表区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column label type="index"></el-table-column>
        <el-table-column label="商品名称" prop="productName"></el-table-column>
        <el-table-column label="商品数量" prop="productNum"></el-table-column>
        <el-table-column label="商品价格" prop="productPrice"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      //查询参数
      queryInfo: {
        query: "",
        pageNo: 1,
        pageSize: 10
      },
      goodsList: [],
      total: 0
    };
  },
  created() {
    this.getProductList();
  },
  methods: {
    async getProductList() {
      const { data: res } = await this.$http.get("goods/getProductList", {
        params: this.queryInfo
      });
      if (res.meta.status != 200)
        return this.$message.error("获取商品列表失败");
      this.$message.success("获取商品列表成功");
      this.goodsList = res.data;
      this.total = res.meta.count;
    },
    //监听分页大小的改变
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize;
      this.getProductList()
    },
    //监听页码的改变
    handleCurrentChange(newPageNo) {
      this.queryInfo.pageNo = newPageNo;
      this.getProductList()
    },
    //根据id删除数据
   async removeById(id){
       const confirmresult=await  this.$confirm('此操作将永久删除该商品么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmresult!=='confirm'){
            return this.$message.info('取消了删除')
        }
         const {data:res} =await this.$http.get('goods/deleteById',{params:{id:id}})
         if(res.meta.status!=200) return this.$message.error('删除商品失败')
         this.$message.success('删除商品成功')
         this.getProductList()
    },
    //跳转到添加商品页面
    goaddPage(){
      this.$router.push('/goods/add')
    }
  }
};
</script>
<style lang="less" scoped>
</style>