<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工薪资</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <!--搜索-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="2" >
          <el-button type="danger" @click="addStorage">添加工资记录</el-button>
          <!--          <el-button type="primary" @click="goaddPage">添加商品</el-button>-->
        </el-col>
        <el-col :span="4" :push="12" >
          <el-date-picker
            v-model="queryInfo.queryTime"
            type="date"
            @change="getTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择入库日期">
          </el-date-picker>
        </el-col>
        <el-col :span="4" :push="12">
          <!--<el-input placeholder="请输入内容" clearable @clear="getProductList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getProductList"></el-button>
          </el-input>-->
          <el-input  placeholder="请输入产品型号" v-model="queryInfo.keywords"></el-input>
        </el-col>
        <el-col :span="4" :push="12">
          <el-button type="primary" @click="getProductList">查 询</el-button>
          <!--          <el-button type="primary" @click="goaddPage">添加商品</el-button>-->
        </el-col>
      </el-row>
      <!--列表区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column label type="index"></el-table-column>
        <el-table-column label="流水号" prop="intoId"></el-table-column>
        <el-table-column label="产品型号" prop="model"></el-table-column>
        <el-table-column label="条形码" prop="barCode"></el-table-column>
        <el-table-column label="入库日期" prop="intoDate"></el-table-column>
        <el-table-column label="入库单价" prop="price"></el-table-column>
        <el-table-column label="入库数量" prop="inCount"></el-table-column>
        <el-table-column label="操作人员" prop="operator"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <!--<el-table-column label="操作">
          <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)">删除</el-button>
        </template>
        </el-table-column>-->

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加入库" :visible="dialogShow" @close="dialogClose">
      <el-form ref="salary" :rules="rules" :model="salary" label-width="80px" class="demo-ruleForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="型号" prop="model">
              <el-input v-model="salary.model" placeholder="请输入型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="条形码" prop="barCode">
              <el-input v-model="salary.barCode" placeholder="请输入条形码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item type="date" label="入库日期" prop="intoDate">
              <el-date-picker
                v-model="salary.intoDate"
                type="date"
                @change="getTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择入库日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model="salary.price" placeholder="请输入价格"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="数量"  prop="inCount">
              <el-input v-model="salary.inCount" placeholder="请输入入库数量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作员"  prop="operator">
              <el-input v-model="salary.operator" placeholder="操作员"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注"  prop="remark">
          <el-input type='textarea' v-model="salary.remark" placeholder="备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提  交</el-button>
          <el-button @click="dialogClose">取  消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  /* eslint-disable */
  export default {
    data() {
      return {
        //查询参数
        queryInfo: {
          keywords: "",
          queryTime: "",
          pageNum: 1,
          pageSize: 10,
        },
        dialogShow: false,
        goodsList: [],
        total: 0,
        salary: {
          model: '',
          barCode: '',
          intoDate: '',
          price: '',
          inCount: '',
          operator: '',
          remark: ''
        },
        rules:{
          model: [{ required: true, message: '请输入产品型号', trigger: 'blur' }],
          barCode: [{ required: true, message: '请输入产品条形码', trigger: 'blur' }],
          intoDate: [{ required: true, message: '请选择入库日期', trigger: 'blur' }],
          price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
          inCount: [{ required: true, message: '请输入入库数量', trigger: 'blur' }],
          operator: [{ required: true, message: '请输入操作员', trigger: 'blur' }]
        }
      };
    },
    created() {
      this.getProductList();
    },
    methods: {
      async getProductList() {
        const { data: res } = await this.$http.get("salary/list", {
          params: this.queryInfo
        });
        if (res.status != 200)
          //return this.$message.error("获取商品列表失败");
          console.log(res.data.list);
        //this.$message.success("获取商品列表成功");
        this.goodsList = res.data.list;
        this.total = res.data.total;
        this.queryInfo.keywords="";
        this.queryInfo.queryTime="";
      },
      //监听分页大小的改变
      handleSizeChange(newPageSize) {
        this.queryInfo.pageSize = newPageSize;
        this.getProductList()
      },
      //监听页码的改变
      handleCurrentChange(newPageNo) {
        this.queryInfo.pageNum = newPageNo;
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
      getTime(date){
        this.time = date;
        console.log(this.time);
      },
      onSubmit () {
        this.$refs['salary'].validate(async valid=>{
          if(valid){
            const { data: res } = await this.$http.post("salary/add", this.salary);
            console.log(res)
            if (res.status != 200)
              return this.$message.error("提交失败，请重试");
            console.log(res.msg);
            this.$message.success("提交成功");
            this.getProductList();
            //console.log("&&&&&&&&&&&   ",this.$refs.submitForm)
            //this.$refs[submitForm].resetFields();
            //表单输入框重置
            this.$refs['salary'].resetFields();
            //this.$refs[form].resetFields();
            //关闭弹窗
            this.dialogShow=false;
          }else {
            console.log('');
            return false;
          }
        });
      },
      getTime (date) {
        this.time = date
        console.log(this.time)
      },
      addStorage(){
        this.dialogShow=true;
      },
      dialogClose () {
        // eslint-disable-next-line no-undef
        console.log(this.dialogShow)
        this.dialogShow = false
      }
    }
  };
</script>
<style lang="less" scoped>
</style>
