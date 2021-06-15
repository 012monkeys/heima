<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

     <el-card>
       <!-- 添加分类按钮 -->
       <el-row>
         <el-col>
           <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
         </el-col>
       </el-row>
      <!-- 分类列表区域 -->
      <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="true">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false " style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" size="mini" round plain @click="onUpdataCate(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" round plain @click="onDeleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- <el-table  :data="cateList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效"></el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag type="succss" v-else-if="scope.row.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table> -->
      <!-- 页码 -->
       <el-pagination @current-change="handleCurrentChange" :current-page="cateInfo.pagenum" :page-size="cateInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
     </el-card>

     <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="30%" @close="addCateDialogClosed">
       <el-form ref="addCateFormRef" :model="addCateform" status-icon label-width="100px" :rules="addCateFormRules">
         <el-form-item label="分类名称" prop="cat_name">
           <el-input v-model="addCateform.cat_name"></el-input>
         </el-form-item>
         <el-form-item label="父级分类">
           <el-cascader v-model="parentCateSeletedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged" clearable></el-cascader>
         </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类 -->
    <el-dialog title="编辑分类" :visible.sync="updataCateDialogVisible" width="30%" @close="updataCateDialogClosed">
       <el-form ref="updataCateFormRef" :model="updataCateform" status-icon label-width="100px" :rules="addCateFormRules">
         <el-form-item label="分类名称" prop="cat_name">
           <el-input v-model="updataCateform.cat_name"></el-input>
         </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updataCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdataCateSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      cateInfo: { // 查询条件
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [ // treeTabel组件渲染参数
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      addCateDialogVisible: false,
      updataCateDialogVisible: false,
      addCateform: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      updataCateform: {
        cat_name: '',
        cat_id: '',
        cat_pid: '',
        cat_level: ''
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      // 联级选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 联级选择器保存对象
      parentCateSeletedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() { // 获得所有分类列表
      const { data: res } = await this.$http.get('categories', {
        params: this.cateInfo
      })
      if (res.meta.status !== 200) return
      this.total = res.data.total
      this.cateList = res.data.result
      console.log(res.data)
    },
    handleCurrentChange(newPage) { // 选择不同的页数
      this.cateInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() { // 获得父级分类
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.parentCateList = res.data
    },
    parentCateChanged() { // 联级选择器
      if (this.parentCateSeletedKeys.length > 0) {
        const length = this.parentCateSeletedKeys.length
        this.addCateform.cat_pid = this.parentCateSeletedKeys[length - 1]
        this.addCateform.cat_level = length
      } else {
        this.addCateform.cat_pid = 0
        this.addCateform.cat_level = 0
      }
    },
    async addCateSubmit() { // 添加新分类
      await this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateform)
        if (res.meta.status !== 201) return this.$message.error('获取失败')
        this.addCateDialogVisible = false
        this.$message.success('添加新分类成功')
        this.getCateList()
      })
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.parentCateSeletedKeys = []
      this.addCateform.cat_pid = 0
      this.addCateform.cat_level = 0
    },
    onUpdataCate(row) { // 确定修改分类
      this.updataCateform = row
      this.updataCateDialogVisible = true
    },
    updataCateDialogClosed() {
      this.$refs.updataCateFormRef.resetFields()
    },
    onUpdataCateSubmit() { // 提交编辑分类
      this.$refs.updataCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.updataCateform.cat_id, this.updataCateform)
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        this.updataCateDialogVisible = false
        this.$message.success(res.meta.msg)
        this.getCateList()
      })
    },
    async onDeleteCate(id) { // 删除分类
      const confirmResult = await this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('操作失败')
      this.$message.success('删除成功')
      this.getCateList()
    }
  }

}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
