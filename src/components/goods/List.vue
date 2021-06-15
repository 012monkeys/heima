<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goodsListdialogVisible = true">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsListData" border stripe >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" height="80px"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="100px"></el-table-column>
        <el-table-column label="商品状态" prop="goods_state" width="100px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row)" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="deleteDialog(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改用户的对话框 -->
    <el-dialog title="提示修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" status-icon :rules="editFormRules" label-width="90px">
        <!-- 用户名 -->
        <el-form-item prop="goods_name" label="商品名称">
          <el-input v-model="editForm.goods_name" ></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item  label="重量">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="创造时间">
          <el-input v-model="editForm.add_time" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsListData: [],
      goodsListdialogVisible: false,
      editDialogVisible: false,
      total: 0,
      editForm: {},
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log('🚀 ~ file: List.vue ~ line 56 ~ getGoodsList ~ res', res.data)
      this.total = res.data.total
      this.goodsListData = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    showEditDialog() {
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async deleteDialog(row) { // 删除商品信息
      const confirmResult = await this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除!'
        })
      }
      const { data: res } = await this.$http.delete('goods/' + row.goods_id)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: '删除失败'
        })
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    editUserInfo() {

    }
  }
}
</script>

<style lang="less" scoped>
</style>
