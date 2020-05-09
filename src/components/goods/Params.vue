<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <!--警告区域-->
      <el-alert show-icon title="注意：只允许为第三级分类添加参数" type="warning" :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!--选择商品的级联选择框-->
          <el-cascader
            expand-trigger="hovor"
            v-model="selectedKeys"
            :options="parentList"
            :props="cascaderProps"
            clearable
            change-on-select
            @change="parentCatechanged"
          ></el-cascader>
        </el-col>
      </el-row>
      <!--tab页签区域-->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <!--动态参数面板--->
        <el-tab-pane label="动态参数" name="diagnizeParam">
          <el-button
            type="primary"
            @click="addparamsDialogVisible=true"
            size="mini"
            :disabled="isbtnDisabled"
          >添加属性</el-button>
          <!--动态表格数据--->
          <el-table :data="diagnizeParamTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  v-for="(item,i) in scope.row.paramsValue"
                  :key="i"
                  closable
               @close="handleClosed(i,scope.row)" >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
              <!--标签切换-->
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="paramsName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeById(scope.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--静态属性面板--->
        <el-tab-pane label="静态属性" name="staticParam">
          <el-button
            type="primary"
            @click="addparamsDialogVisible=true"
            size="mini"
            :disabled="isbtnDisabled"
          >添加属性</el-button>
          <!--静态属性面板数据-->
          <el-table :data="staticParamTableData" border stripe>
           <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  v-for="(item,i) in scope.row.paramsValue"
                  :key="i"
                  closable
               @close="handleClosed(i,scope.row)" >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
              <!--标签切换-->
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="paramsName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeById(scope.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加动态参数和静态资源的对话框-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addparamsDialogVisible"
      width="30%"
      left
      @close="addparamsDialogClosed"
    >
      <el-form ref="addformrefs" :model="addform" :rules="addformRules" label-width="80px">
        <el-form-item label="属性名称" prop="paramsName">
          <el-input v-model="addform.paramsName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addparamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改属性对话框-->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editparamsDialogVisible"
      width="30%"
      left
      @close="editparamsDialogClosed"
    >
      <el-form ref="editformrefs" :model="editform" :rules="addformRules" label-width="80px">
        <el-form-item label="属性名称" prop="paramsName">
          <el-input v-model="editform.paramsName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editparamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      //级联菜单返回的父List
      parentList: [],
      //配置级联选择器的props
      cascaderProps: {
        value: "categoryId",
        label: "categoryName",
        children: "children"
      },
      //选中的父级分类的id数组
      selectedKeys: [],
      activeName: "diagnizeParam",
      diagnizeParamTableData: [],
      staticParamTableData: [],
      addparamsDialogVisible: false,
      addform: {
        paramsName: "",
        categoryId: "",
        strtype: ""
      },
      addformRules: {
        paramsName: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ]
      },
      editparamsDialogVisible: false,
      editform: {},
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getCateGoryList();
  },
  methods: {
    async getCateGoryList() {
      const { data: res } = await this.$http.get("category/getCateGoryList");
      if (res.meta.status != 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.parentList = res.data;
    },
    //监听级联菜单改变事件
    parentCatechanged() {
      this.getParamsData();
    },
    //点击tab触发事件
    tabClick() {
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        //数据清空
        this.selectedKeys = [];
        this.diagnizeParamTableData=[]
        this.staticParamTableData=[]
        return;
      }
      //发送请求
      const { data: res } = await this.$http.get(
        "category/getCateGoryParamsList",
        {
          params: { type: this.activeName, categoryId: this.cateId }
        }
      );
      //处理数组
      res.data.forEach(item => {
        item.paramsValue=item.paramsValue?item.paramsValue.split(' '):[];
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);
      if (this.activeName === "diagnizeParam") {
        this.diagnizeParamTableData = res.data;
      } else {
        this.staticParamTableData = res.data;
      }
    },
    //监听添加属性的对话框的关闭事件
    addparamsDialogClosed() {
      this.$refs.addformrefs.resetFields();
    },
    //保存属性数据，发起请求
    saveParams() {
      this.$refs.addformrefs.validate(async valid => {
        if (valid) {
          this.addform.categoryId = this.cateId;
          this.addform.strtype = this.activeName;
          const { data: res } = await this.$http.post(
            "category/saveCateGoryParams",
            this.addform
          );
          if (res.meta.status != 200) return this.$message.error("添加失败");
          this.$message.error("添加成功");
          this.addparamsDialogVisible = false;
          this.getParamsData();
        }
      });
    },
    async showEditDialog(role) {
      //准备信息展示对话框 根据id查询信息
      const { data: res } = await this.$http.get(
        "category/getCateGoryParamsById",
        {
          params: { id: role.id }
        }
      );
      if (res.meta.status != 200)
        return this.$message.error("获取属性详情失败");
      this.$message.success("获取属性详情成功");
      this.editform = res.data;
      this.editparamsDialogVisible = true;
    },
    //监听编辑属性对话框事件
    editparamsDialogClosed() {},
    //更新属性信息
    updateParams() {
      //保存之前验证数据
      this.$refs.editformrefs.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "category/saveCateGoryParams",
          this.editform
        );
        if (res.meta.status != 200)
          return this.$message.error("更新属性信息失败");
        this.$message.success("更新属性信息成功");
        //更新数据
        this.getParamsData();
        this.editparamsDialogVisible = false;
      });
    },
    async removeById(id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该属性么, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmresult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.get(
        "category/deleteCategoryById",
        { params: { id: id } }
      );
      if (res.meta.status != 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getParamsData();
    },
    //文本框和按钮切换
    handleInputConfirm(row) {
      //判断字符是否合法
      if (row.inputValue.trim() === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
       //把添加的参数放到数组里面
      row.paramsValue.push(row.inputValue.trim())
      row.inputValue = "";
      row.inputVisible = false;
      //保存参数值
      this.saveParamsValues(row)
    },
    //展示输入框
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async saveParamsValues(row){
      //发起请求，插入更新数据库
      const{data:res}=await this.$http.get('category/updateParamsValues',{params:{id:row.id,paramsValues:row.paramsValue.join(' ')}})
      if(res.meta.status!=200) return this.$message.error('修改属性值失败')
      this.$message.success('修改属性值成功')
    },
    //tag标签关闭事件,删除对应的可选项
    handleClosed(i,row){
      row.paramsValue.splice(i,1)
      //保存数据
      this.saveParamsValues(row)
    }
  },
  //计算属性
  computed: {
    //是否禁用按钮
    isbtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //返回虚线中的三级分类的Id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[this.selectedKeys.length - 1];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "diagnizeParam") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>