<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 600px;height: 400px;"></div>
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash'
const echarts = require('echarts')
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
  },
  async mounted() {
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return
    // 页面渲染完毕, 获得dom
    const myChart = echarts.init(document.getElementById('main'))
    const newData = _.merge(res.data, this.options) // 深拷贝
    myChart.setOption(newData)
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
