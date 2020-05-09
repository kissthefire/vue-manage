<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="addCateGoryDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treetable"
      >
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.ifValid==true" style="color:lightgreen" class="el-icon-success"></i>
          <i v-if="scope.row.ifValid==false" style="color:red" class="el-icon-error"></i>
        </template>
        <!--排序-->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.categoryLevel===1">一级</el-tag>
          <el-tag v-if="scope.row.categoryLevel===2" type="warning">二级</el-tag>
          <el-tag v-if="scope.row.categoryLevel===3" type="success">三级</el-tag>
        </template>
        <!--操作-->
        <template slot="operate" slot-scope="scope">
{{scope.row.categoryId}}
<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--分页-->
    </el-card>
    <!--添加分类的对话框-->
    <el-dialog
  title="添加分类"
  :visible.sync="addCategorydialogVisible"
  width="30%"
  @closed="addDialogClosed"
  >
  <el-form ref="addCateGoryformRef" :model="addCateGoryform" label-width="100px" :rules="addCateGoryformRules">
  <el-form-item label="分类名称:" prop="categoryName">
    <el-input v-model="addCateGoryform.categoryName"></el-input>
  </el-form-item>
  <el-form-item label="父级分类:" prop="categoryName">
     <el-cascader
     expand-trigger="hovor"
    v-model="selectedKeys"
    :options="parentList"
    :props="cascaderProps"
    @change="parentCatechanged"
    clearable
    change-on-select
    ></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCategorydialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveCategory">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      cateList: [],
      columns: [
        {
          label: "分类名称",
          prop: "categoryName"
        },
        {
          label: "是否有效",
          prop: "ifValid",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          prop: "categoryLevel",
          type: "template",
          template: "level"
        },
        {
          label: "操作",
          type: "template",
          template: "operate"
        }
      ],
      addCategorydialogVisible:false,
      //添加分类的表单
      addCateGoryform:{
        categoryName:'',
        categoryLevel:1,
        parentId:0
      },
      //添加分类的规则
      addCateGoryformRules:{
        categoryName:[
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1到 15 个字符",
            trigger: "blur"
          }
          
        ]
      },
      //级联菜单返回的父List
      parentList:[],
      //配置级联选择器的props
      cascaderProps:{
        value:'categoryId',
        label:'categoryName',
        children:'children'
      },
      //选中的父级分类的id数组
      selectedKeys:[]
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    async getCategoryList() {
      const { data: res } = await this.$http.get("category/getCateGoryList");
      if (res.meta.status != 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.cateList = res.data;
      this.$message.success("获取分类列表成功");
    },
    //打开添加分类的对话框
    async addCateGoryDialog(){
      const { data: res } = await this.$http.get("category/getCateGoryList",{params:{type:2}});
      if (res.meta.status != 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.parentList = res.data;
      this.addCategorydialogVisible=true
    },
    //选择项发生改变
    parentCatechanged(){
       console.log(this.selectedKeys)
       //如果selectedKeys 的长度等于0时，无父节点。为第一级
       //大于0选中了父级分类需要为addCateGoryform 重新赋值
       if(this.selectedKeys.length>0){
           this.addCateGoryform.parentId=this.selectedKeys[this.selectedKeys.length-1];
           this.addCateGoryform.categoryLevel=this.selectedKeys.length+1;
           return
       }else{
          this.addCateGoryform.parentId=0;
           this.addCateGoryform.categoryLevel=1;
       }
    },
    //保存分类数据
     saveCategory(){
      //执行预校验
      this.$refs.addCateGoryformRef.validate(async valid=>{
       if(!valid) return
       //发起请求
      const { data: res} = await this.$http.post('category/saveCategory',this.addCateGoryform);
       if(res.meta.status!=200) return this.$message.error('保存分类失败')
       this.$message.success('保存分类成功')
       this.getCategoryList();
       this.addCategorydialogVisible=false;
      })
      console.log(this.addCateGoryform)
    },
    //监听添加分类的对话框的关闭事件
    addDialogClosed(){
      this.$refs.addCateGoryformRef.resetFields();
       this.selectedKeys=[]
       this.addCateGoryform.categoryLevel=1;
       this.addCateGoryform.parentId=0
    }
  }
};
</script>
<style lang="less" scoped>
.treetable{
  margin-top: 15px
}
</style>