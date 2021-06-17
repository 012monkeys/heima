<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status"></el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="update_time">
          <template slot-scope="scope">
            {{scope.row.update_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"  @click="showAddDialog(scope)" size="mini"></el-button>
            <el-button type="success" icon="el-icon-location"  @click="showProgress(scope)" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="提示修改地址" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" status-icon  label-width="90px" :rules="addFormRules">
        <!-- 用户名 -->
        <el-form-item label="省市区/县" prop="consignee_city">
          <el-cascader v-model="citySeletedKeys" :props="cascaderProps" :options="cityData" clearable></el-cascader>
        </el-form-item>
        <el-form-item prop="consignee_addr" label="详细地址">
          <el-input v-model="addForm.consignee_addr"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="50%" >
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in progressForm" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      reverse: true,
      addForm: {}, // 保存修改地址的表单数据
      addFormRules: {
        consignee_city: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        consignee_addr: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      },
      progressForm: {}, // 保存物流信息
      orderList: [],
      total: 0,
      cityData, // 城市参数
      cascaderProps: { // 联级选择器的配置
        value: 'value',
        children: 'children',
        label: 'label',
        expandTrigger: 'hover'
      },
      citySeletedKeys: [], // 保存联级选择器
      addDialogVisible: false,
      progressDialogVisible: false
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() { // 获得订单列表
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    async showProgress() { // 显示物流信息
      // const { data: res } = await this.$http.get('kuaidi/1106975712662') 端口存在问题
      const res = this._progressData()
      this.progressDialogVisible = true
      this.progressForm = res.data
      console.log('🚀 ~ showProgress ~ this.progressForm', this.progressForm)
    },
    handleSizeChange(newPagesize) { // 页码大小发生变化时
      this.queryInfo.pagesize = newPagesize
      this.queryInfo.pagenum = 1
      this.getOrderList()
    },
    handleCurrentChange(newPage) { // 页码发生变化时
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    addDialogClosed() {
      this.citySeletedKeys = []
      this.$refs.addFormRef.resetFields()
    },
    _progressData() { // 模拟数据
      return {
        data: [
          {
            time: '2018-05-10 09:39:00',
            ftime: '2018-05-10 09:39:00',
            context: '已签收,感谢使用顺丰,期待再次为您服务',
            location: ''
          },
          {
            time: '2018-05-10 08:23:00',
            ftime: '2018-05-10 08:23:00',
            context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
            location: ''
          },
          {
            time: '2018-05-10 07:32:00',
            ftime: '2018-05-10 07:32:00',
            context: '快件到达 [北京海淀育新小区营业点]',
            location: ''
          }]
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
