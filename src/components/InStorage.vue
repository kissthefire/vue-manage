<template>
   <div>
     <el-dialog title="添加入库" :visible="dialogShow=true" @close="dialogClose">
       <el-form ref="form" :model="instorage" label-width="80px">
         <el-row>
           <el-col :span="8">
             <el-form-item label="型号">
               <el-input v-model="instorage.model"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="条形码">
               <el-input v-model="instorage.barCode"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="8">
             <el-form-item type="date" label="入库日期">
               <el-date-picker
                 v-model="time"
                 type="date"
                 @change="getTime"
                 format="yyyy-MM-dd"
                 placeholder="请选择入库日期">
               </el-date-picker>
             </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="价格">
               <el-input v-model="instorage.price"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="8">
             <el-form-item label="数量">
               <el-input v-model="instorage.inCount"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="操作员">
               <el-input v-model="instorage.operator"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
         <el-form-item label="备注">
           <el-input type='textarea' v-model="instorage.remark"></el-input>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="onSubmit">提  交</el-button>
           <el-button>取  消</el-button>
         </el-form-item>
       </el-form>
       <!--<div slot="footer" class="dialog-footer">
         <el-button >取 消</el-button>
         <el-button type="primary">提 交</el-button>
       </div>-->
     </el-dialog>
   </div>
</template>

<script>
export default {
  name: 'InStorage',
  data () {
    return {
      instorage: {
        'model': '',
        'barCode': '',
        'intoDate': '',
        'price': '',
        'inCount': '',
        'operator': '',
        'remark': ''
      },
      time: '',
      dialogShow: false
    }
  },
  methods: {
    onSubmit () {
      console.log('hello')
    },
    getTime (date) {
      this.time = date
      console.log(this.time)
    },
    dialogClose () {
      // eslint-disable-next-line no-undef
      console.log(dialogShow)
      this.dialogShow = false
    }
  }
}
</script>

<style scoped>

</style>
