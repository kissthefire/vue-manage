<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!--步骤条-->
      <el-steps align-center :space="200" :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab栏区域-->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTableave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="addForm.productName" placeholder></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="productPrice">
              <el-input v-model="addForm.productPrice" type="number" placeholder></el-input>
            </el-form-item>
            <el-form-item label="商品分类:" prop="categoryId">
              <el-cascader
                expand-trigger="hovor"
                v-model="selectedKeys"
                :options="cateList"
                :props="cascaderProps"
                @change="parentCatechanged"
                clearable
                change-on-select
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.paramsName" v-for="item in diagnizeParamData" :key="item.id">
              <el-checkbox-group v-model="item.paramsValue">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.paramsValue" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.paramsName" v-for="item in staticParamData" :key="item.id">
              <el-input v-model="item.paramsValue"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.productDesc"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--图片预览-->
    <el-dialog title="图片预览" :visible.sync="imagedialogVisible" width="50%">
     <img :src="preViewPath" class="preViewImage">
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        productName: "",
        productPrice: 0,
        productNum: 0,
        categoryId: 0,
        productImageurl: "",
        productDesc:'',
        productParams:''
      },
      //定义规则
      addFormrules: {
        productName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        productPrice: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        productNum: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      //商品分类列表
      cateList: [],
      //配置级联选择器的props
      cascaderProps: {
        value: "categoryId",
        label: "categoryName",
        children: "children"
      },
      //选中的父级分类的id数组
      selectedKeys: [],
      //动态参数列表数据
      diagnizeParamData: [],
      staticParamData: [],
      //图片上传的url
      uploadUrl: "http://localhost:8083/upload",
      //图片上传请求头
      headerObj: {
        token: window.sessionStorage.getItem("token")
      },
      //商品图片url集合
      productImageurlArray: [],
      //预览图片路径
      preViewPath: "",
      imagedialogVisible:false,
      //商品参数集合
      productParamsArray:[]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("category/getCateGoryList");
      if (res.meta.status != 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.cateList = res.data;
      this.$message.success("获取分类列表成功");
    },
    //选择项发生改变
    parentCatechanged() {
      if (this.selectedKeys.length !== 3) return (this.selectedKeys = []);
      this.addForm.categoryId = this.selectedKeys[2];
    },
    //标签页切换，判断
    beforeTableave(activeName, oldName) {
      if (oldName === "0" && this.selectedKeys.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    //标签切换绑定事件
    async tabClicked() {
      //新增标签切换
      if (this.activeIndex === "1") {
        //发送请求
        const { data: res } = await this.$http.get(
          "category/getCateGoryParamsList",
          {
            params: { type: "diagnizeParam", categoryId: this.cateId }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败");
        }
        this.$message.success("获取动态参数列表成功");
        //处理数组
        res.data.forEach(item => {
          item.paramsValue = item.paramsValue
            ? item.paramsValue.split(" ")
            : [];
        });
        this.diagnizeParamData = res.data;
      } else if (this.activeIndex === "2") {
        //发送请求
        const { data: res } = await this.$http.get(
          "category/getCateGoryParamsList",
          {
            params: { type: "staticParam", categoryId: this.cateId }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败");
        }
        this.$message.success("获取动态参数列表成功");
        //处理数组
        // res.data.forEach(item => {
        //   item.paramsValue = item.paramsValue
        //     ? item.paramsValue.split(" ")
        //     : [];
        // });
        this.staticParamData = res.data;
      }
    },
    //处理图片预览的业务
    handlePreview(file) {
      this.preViewPath = file.response.data;
      this.imagedialogVisible =true
    },
    //处理图片移除的业务
    handleRemove(file) {
      const filepath = file.response.data;
      //查找并移除
      const i = this.productImageurlArray.findIndex(x => x.pic === filepath);
      this.productImageurlArray.splice(i, 1);
      //console.log(this.productImageurlArray)
    },
    //监听图片上传成功
    handleSuccess(response) {
      const picinfo = { pic: response.data };
      this.productImageurlArray.push(picinfo);
    },
    //添加商品
     add(){
     console.log(this.addForm)
     this.$refs.addFormRef.validate(async valid =>{
       if(!valid){
         return this.$message.error('请选择必填项')
       }
       //执行添加的业务逻辑
       this.addForm.productImageurl=this.productImageurlArray.join();
       //处理属性
       this.diagnizeParamData.forEach(item=>{
        const newInfo={id:item.id,value:item.paramsValue.join(' ')}
        this.productParamsArray.push(newInfo)
       })
       // 静态属性
       this.staticParamData.forEach(item=>{
        const newInfo={id:item.id,value:item.paramsValue}
        this.productParamsArray.push(newInfo)
       })
       this.addForm.productParams=this.productParamsArray.join(' ')
       //执行添加请求
      const {data:res} = await this.$http.post('goods/addProduct',this.addForm)
      console.log(res)
     })
    }
  },
  computed: {
    //返回虚线中的三级分类的Id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[this.selectedKeys.length - 1];
      }
      return null;
    }
  }
};
</script>
<style lang="less" scoped>
.el-checkbox {
  //上 右 下 左
  margin: 0 5px 0 0 !important;
}
.preViewImage{
  width: 100%;
}
.btnAdd{
  margin-top: 16px
}
</style>