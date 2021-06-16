<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form ref="addFormRef" :model="addForm" status-icon :rules="addFormRules" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabsLeave" @tab-click="onTabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addForm.goods_name" ></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addForm.goods_price"  type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item  prop="goods_cat" label="商品分类">
              <!-- 联级选择器 -->
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cascaderProps" clearable @change="cateChanged"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item  :label="item.attr_name" v-for="item, index in manyTableData" :key="index">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="el" v-for="el, i in item.attr_vals" :key="i" border size="small"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item  :label="item.attr_name" v-for="item, index in onlyTableData" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload class="upload-img" :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove"
            list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor class="quill-editor-box" v-model="addForm.goods_introduce" ></quill-editor>
            <el-button class="add-btn" type="primary" @click="onSubimtAddGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="30%">
      <img :src="previewPath" width="100%">
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addForm: {
        goods_cat: [], // 联级选择器的index
        goods_price: 10,
        goods_weight: 10,
        goods_number: 10,
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      cateList: [], // 商品分类
      cascaderProps: { // 联级选择器的配置
        value: 'cat_id',
        children: 'children',
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      activeIndex: 0,
      manyTableData: [],
      onlyTableData: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: { // upload配置token
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '', // 预览图片的地址
      previewDialogVisible: false, // 图片预览
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
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
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    cateChanged() {
      const length = this.addForm.goods_cat.length
      if (length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabsLeave(activeName, oldActiveName) { // 便签页的切换
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类信息')
        return false
        // this.addForm.goods_cat = [0, 1, 6]
      }
    },
    handlePreview(data) { // 点击图片预览
      console.log('🚀 ~ handlePreview ~ response', data)
      this.previewPath = data.response.data.url
      this.previewDialogVisible = true
    },
    handleRemove(file) { // 删除图片, 移除保存在数组中的路径
      const path = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(item => {
        return item.pic === path
      })
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    handleSuccess(response) { // 图片上传成功时的回调
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log('🚀 ~ file: Add.vue ~ line 141 ~ handleSuccess ~ this.addForm.pics', this.addForm.pics)
    },
    async onTabClick() { // 切换便签页时, 处理请求
      if (this.activeIndex === '1') { // 标签页点击的是动态参数时, 请求数据
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => { // 把item.attr_vals变成数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTableData = res.data
      }
    },
    async onSubimtAddGoods() { // 提交商品所有信息
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要信息')
        }
        const addFormData = this._addGoods()
        console.log(addFormData)
        const { data: res } = await this.$http.post('goods', addFormData)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    },
    _addGoods() { // 格式化提交新增商品数据
      const formData = { ...this.addForm }
      formData.goods_cat = formData.goods_cat.join(',') // 格式化分类
      this.manyTableData.forEach(element => { // 动态数据
        const newInfo = {
          attr_id: element.attr_id,
          attr_value: element.attr_vals.join(' ')
        }
        formData.attrs.push(newInfo)
      })
      this.onlyTableData.forEach(element => { // 静态数据
        const newInfo = {
          attr_id: element.attr_id,
          attr_value: element.attr_vals
        }
        formData.attrs.push(newInfo)
      })
      return formData
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length !== 3) {
        return null
      }
      return this.addForm.goods_cat[2]
    }
  }
}
</script>

<style lang="less" scoped>
.el-tabs{
  margin-top:30px;
}
.el-checkbox{
  margin: 0 10px 10px 0 !important;
}
.upload-img{
  width:500px;
}

.add-btn{
  margin-top: 15px;
}
</style>
