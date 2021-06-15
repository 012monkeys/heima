<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

     <el-card>
       <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="cate-top">
         <el-col>
           <span>选择商品分类:</span>
           <el-cascader v-model="cateSeletedKeys" :options="cateList" :props="cascaderProps" clearable @change="cateChanged"></el-cascader>
         </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="onHandleTab">
        <!-- 动态属性 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addParams">添加参数</el-button>
          <!-- 表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
               <template slot-scope="scope" v-if="scope.row.attr_vals">
                  <el-tag @close="onRemoveAttrValue(scope.row, index)" class="tag-left" closable v-for="item, index in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
               </template>
            </el-table-column>
            <el-table-column  type="index" label="#"></el-table-column>
            <el-table-column  prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope" >
               <el-button type="primary" icon="el-icon-edit" size="mini" @click="reviseParams(scope.row)">编辑</el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addParams">添加属性</el-button>
          <!-- 表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
               <template slot-scope="scope" v-if="scope.row.attr_vals">
                  <el-tag @close="onRemoveAttrValue(scope.row, index)" class="tag-left" closable v-for="item, index in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
               </template>
            </el-table-column>
            <el-table-column  type="index" label="#"></el-table-column>
            <el-table-column  prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="reviseParams(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-detele" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        </el-tabs>
     </el-card>

     <!-- 动态参数弹窗 -->
     <el-dialog title="提示修改参数" :visible.sync="reviseParamsVisible" width="30%" @close="paramsDialogClosed">
      <el-form ref="paramsFormRef" :model="paramsForm" status-icon label-width="100px" :rules="paramsRule">
        <!-- 用户名 -->
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviseParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增参数对话框 -->
    <el-dialog :title="'新增'+titleText" :visible.sync="addParamsVisible" width="50%" @close="addParamsDialogClosed">
      <el-form ref="addParamsFormRef" :model="addParamsForm" status-icon label-width="120px" :rules="paramsRule">
        <!-- 用户名 -->
        <el-form-item :label="'新增'+titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitAddParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      cascaderProps: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      cateSeletedKeys: [], // 联级选择器保存的key
      activeName: 'many',
      manyTableData: [], // 动态绑定表格data
      onlyTableData: [], // 静态
      reviseParamsVisible: false,
      addParamsVisible: false,
      inputVisible: false, // tag文本框切换输入框
      inputValue: '', // tag文本框切换输入框绑定值
      paramsForm: { // 修改manyParams
        attr_name: '',
        attr_id: ''
      },
      addParamsForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      paramsRule: {
        // 表单验证规则
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() { // 获得所有分类列表
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return
      this.cateList = res.data
    },
    async cateChanged() { // 联级选择器弹出关闭时
      this.getCateAttributes()
    },
    async getCateAttributes() { // 获得三级分类参数
      const length = this.cateSeletedKeys.length
      if (length !== 3) {
        this.cateSeletedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 选择的是三级分类时, 显示参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(item => { // 把item.attr_vals变成数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    onHandleTab() { // 标签页切换
      this.getCateAttributes()
    },
    reviseParams(row) { // 编辑动态属性
      this.paramsForm.attr_name = row.attr_name
      this.paramsForm.attr_id = row.attr_id
      this.paramsForm.attr_sel = row.attr_sel
      this.paramsForm.attr_vals = row.attr_vals
      this.reviseParamsVisible = true
    },
    paramsDialogClosed() { // 重置编辑动态属性
      this.$refs.paramsFormRef.resetFields()
    },
    onSubmitParams() { // 提交编辑属性名称
      this.$refs.paramsFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.paramsForm.attr_id}`, this.paramsForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.reviseParamsVisible = false
        this.getCateAttributes()
      })
    },
    async deleteParams(row) { // 删除动态属性
      // 删除用户弹出确定框
      const confirmResult = await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      // 像服务器发送删除请求
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${row.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('操作失败')
      this.$message.success('删除成功')
      this.getCateAttributes()
    },
    addParams() { // 新增参数
      this.addParamsVisible = true
      this.addParamsForm.attr_sel = this.activeName
    },
    onSubmitAddParams() { // 提交新增参数
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, this.addParamsForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addParamsVisible = false
        this.getCateAttributes()
      })
    },
    addParamsDialogClosed() { // 关闭addParams对话框
      this.$refs.addParamsFormRef.resetFields()
    },
    async onRemoveAttrValue(row, index) { // 删除AttrValue
      console.log(row, index)
      const tempArr = row.attr_vals.concat([])
      tempArr.splice(index, 1) // 临时数组避免请求错误
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: tempArr.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      row.attr_vals.splice(index, 1)
      this.$message.success(res.meta.msg)
    },
    async handleInputConfirm(row) { // tag便签输入框确定 str.trim()去前后空白
      console.log('🚀 ~ file: Params.vue ~ line 234 ~ handleInputConfirm ~ row', row)

      if (row.inputValue.trim().length === 0) { // 输入文字为空时
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      const tempArr = row.attr_vals.concat([])
      tempArr.push(row.inputValue.trim()) // 临时数组避免请求错误
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: tempArr.join(' ')
      })
      if (res.meta.status !== 200) {
        row.inputValue = ''
        row.inputVisible = false
        return this.$message.error(res.meta.msg)
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.$message.success(res.meta.msg)
    },
    showInput(row) {
      console.log(row)
      row.inputVisible = true
      this.$nextTick(_ => { // 自动获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    isBtnDisabled() { // btn是否禁用
      if (this.cateSeletedKeys.length === 3) {
        return false
      }
      return true
    },
    cateId() { // 只有设置第三级分类参数, 获得id
      if (this.cateSeletedKeys.length === 3) {
        return this.cateSeletedKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态参数'
    }
  }
}
</script>

<style lang="less" scoped>
.cate-top{
  margin-top: 15px;
}
.tag-left{
  margin-left: 15px;
  margin-top: 15px;
}
.input-new-tag{
  margin-left: 15px;
  width: 120px;
}
.button-new-tag{
  margin-left: 15px;
}
</style>
