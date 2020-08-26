---
title: vue中使用vueChartJs
date: 2020-08-26 15:24:53
tags:
- vue
- 图表
categories: vue
---

### vue-chartJs
[vue-chartJs](https://vue-chartjs.org/zh-cn/)是vue对[Chart.js](http://chartjs.cn/)的封装,可以很简单的创建可复用的图表组件。由于是对底层的封装，所以许多图表的配置，还是需要看这个[Chart.js的文档](http://chartjs.cn/docs/)

### 先简单封装个组件
```javascript
// vBar.vue
<script>
import { Bar } from 'vue-chartjs'

export default {
  name: 'vBar',
  extends: Bar,
  props: ['chartdata', 'options'],
  mounted () {
    this.renderChart(this.chartdata,this.options)
  }
}
</script>
```

### 在需要的地方用这个组件
```javascript
// index.vue
<template>
	<div class="example-3d">
	<vBar :chartdata="vBarData" :options="vOptions" :styles="myStyles"></vBar>
	</div>
</template>
<script>
import { vBar } from '@/components/vCharts/vBar'
export default {
	name: 'barTest',
	components: {
		vBar,
	},
	data() {
		return {
			vBarData: {
				labels: ['1', '2', '3', '4', '5', '6'],
				datasets: [
					{
						data: [1,2,3,4,5,6],
						backgroundColor: '#ffa200',
						barPercentage: 1,
						maxBarThickness: 12,
					},
				],
			},
			vOptions: {
                // 自适应必须要加的下面两个配置
                responsive: true,
                maintainAspectRatio: false,
				layout: {
					padding: {
						left: 5,
						right: 5,
						top: 5,
						bottom: 5,
					},
				},
				legend: { display: false },
				scales: {
					grid: {
						x: 10,
						x2: 20,
						y: 20,
						y2: 10,
					},
					xAxes: [
						{
							gridLines: {
								display: false,
							},
							ticks: {
								display: false,
							},
						},
					],
					yAxes: [
						{
							gridLines: {
								display: false,
							},
							ticks: {
								display: false,
							},
						},
					],
				},
			},
		}
	},
	computed: {
		myStyles() {
			return {
				height: '100px',
                // 自适应必须要加的position: 'relative',
                position: 'relative',
                marginTop: '200px'
			}
		},
	},
	mounted() {},
	created() {},
	methods: {},
}
</script>
```

### vue-chartJs的自适应resize
* v-chart配置
```javascript
Options: {
    responsive: true,
    maintainAspectRatio: false,
}
```
* 组件实例绑定styles属性`:styles="myStyles"`
```javascript
myStyles() {
    return {
        // 自适应必须要加的position: 'relative',
        position: 'relative',
    }
},
```