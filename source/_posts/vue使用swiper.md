---
title: vue使用swiper
date: 2020-08-25 14:26:14
tags:
- vue
- css
- 动画
categories: vue
---

### 在vue项目中使用swiper.js
swiper.js在vue框架中，有一个专业的`vue-awesome-swiper.js`,在vue项目中使用时，需要把这个包也装上。
```bash
    yarn add swiper@5.3.6 vue-awesome-swiper@4.1.0
```
> 上面装包时指定版本，是因为在项目中踩坑了。装了新包不能用。于是查看vue-awesome-swiper[在github上的示例代码](https://github.com/surmon-china/surmon-china.github.io)，发现`swiper@5.3.6 vue-awesome-swiper@4.1.0`，装包后可以使用

### 使用demo
```javascript
<template>
	<div class="example-3d">
		<swiper class="swiper" :options="swiperOption">
			<swiper-slide v-for="(item, index) in colorList" :key="index" :style="'background: '+item">Slide {{index}}</swiper-slide>
		</swiper>
	</div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
	name: 'swiper-example-3d-coverflow',
	title: '3D Coverflow effect',
	components: {
		Swiper,
		SwiperSlide,
	},
	data() {
		return {
            colorList:['#c82829','#f5871f','#eab700','#718c00','#3e999f'],
			swiperOption: {
				initialSlide: 1,
				virtualTranslate: true,
				effect: 'coverflow',
				grabCursor: false,
				centeredSlides: true,
				slidesPerView: 'auto',
				coverflowEffect: {
					rotate: 10,
					stretch: 0,
					depth: 10,
					modifier: 1,
					slideShadows: false,
				},
				on: {
					click: function (swiper, event) {

					},
				},
				slideToClickedSlide: true,
				slidesPerView: 5,
			},
		}
	},
}
</script>

<style lang="scss" scoped>
.example-3d {
	width: 100%;
	height: 400px;
	padding-top: 50px;
	padding-bottom: 50px;
}

.swiper {
	height: 100%;
	width: 100%;

	.swiper-slide {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 300px;
		height: 300px;
		text-align: center;
		font-weight: bold;
		background-color: #2c8dfb;
		background-position: center;
		background-size: cover;
	}
}
</style>

```
