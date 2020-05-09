<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">订单管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <!--搜索-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
     <!--展示数据table-->
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="orderNo" label="订单编号"></el-table-column>
      <el-table-column prop="payment" label="付款金额" width="180"></el-table-column>
      <el-table-column prop="createTime" label="下单时间"></el-table-column>
      <el-table-column prop="ifPay"  label="是否付款">
        <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.ifPay">已付款</el-tag>
           <el-tag type="danger" v-if="!scope.row.ifPay">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改地址"  placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
             @click="editAddressVisible = true"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看物流进度" placement="top" :enterable="false">
            <el-button
              type="primary"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
     <!--分页区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.pageSize"
      layout="total,sizes, prev, pager, next"
      :total="total"
    ></el-pagination>

     <!--修改地址的对话框-->
    <el-dialog title="修改地址" :visible.sync="editAddressVisible" width="40%" left>
      <el-form
      :rules="editAddressRules"
       class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="address1">
        <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--物流信息对话框-->
    <el-dialog
  title="物流信息"
  :visible.sync="expressdialogVisible"
  width="30%"
 >
 <!--物流进度展示-->
    <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in expressProgressInfo"
      :key="index"
      :timestamp="activity.ftime">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  <span slot="footer" class="dialog-footer">
    <el-button @click="expressdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="expressdialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import cityData from './citydata'
export default {
  data() {
    return {
      //获取订单列表的入参
      queryInfo: {
        query: "",
        pageNo: 1,
        pageSize: 10
      },
       total: 10,
       tableData: [],
       editAddressVisible:false,
       addressForm:{
           address1:[],
           address2:''
       },
       editAddressRules:{
          address1: [
          { required: true, message: "请输入省市县", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
       },
       cityData,
       expressdialogVisible:false,
       expressProgressInfo:[]
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
      /***查询订单列表 */
   async getOrderList() {
        const { data: res } = await this.$http.get("orders/getOrderList", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.tableData = res.data;
      this.total = res.meta.count;
    },
    //监听pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getOrderList();
    },
    //监听页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pageNo = newPage;
      this.getOrderList();
    },
    /***查看物流进度*/
   async showProgressBox(row){
      const { data: res } = await this.$http.get("orders/getProductLocationList");
     if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.expressProgressInfo = res.data;
     this.expressdialogVisible=true;
    }
  }
};
</script>
<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>