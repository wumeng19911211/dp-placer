<template>
  <div class="app">
    <div class="dp-container">
      <div class="dp-layout">
        <div class="dp-layout__item" v-for="item in componentList" :key="item.id" :style="getItemStyle(item.layout)" :data-id="item.id">
          <div class="content" v-if="!item.children || item.children.length == 0">
            {{item.id}}
          </div>
          <div class="dp-layout" v-if="item.children && item.children.length > 0" @click.stop>
            <div class="dp-layout__item" v-for="item2 in item.children" :key="item2.id" :style="getItemStyle(item2.layout)">
              {{item2.id}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DpPlacer from '../component/DpPlacer.js'
export default {
  data(){
    return {
      componentList:[
        {
          id: '1',
          layout: {
            left: 0,
            top: 0,
            width: 200,
            height: 200,
            color:'skyblue'
          },
          children:[
            {
              id: '3',
              layout: {
                left: 0,
                top: 0,
                width: 100,
                height: 100,
                color:'green'
              },
            }
          ]
        },
        {
          id: '2',
          layout: {
            left: 250,
            top: 0,
            width: 200,
            height: 200,
            color:'hotpink'
          }
        }
      ]
    }
  },
  methods:{
    getItemStyle(layout) {
      return {
        left: layout.left + 'px',
        top: layout.top + 'px',
        width: layout.width + 'px',
        height: layout.height + 'px',
        backgroundColor: layout.color
      }
    }
  },
  mounted() {
    const dpplacer = new DpPlacer({
      container: '.dp-container',
      layout: '.dp-layout',
      item: '.dp-layout__item'
    })
    dpplacer.setZoom(1)
    dpplacer.on('resize', e => {
      console.log('resize-e :>> ', e);
    })
    dpplacer.on('drag', e => {
      console.log('drag-e :>> ', e);
    })
  }
}
</script>

<style lang="scss" scoped>
  .dp-container {
    width: 500px;
    height: 500px;
    border: 1px solid #000;
    position: relative;
    overflow: hidden;
    .dp-layout {
      width: 100%;
      height: 100%;
      overflow: auto;
      .dp-layout__item {
        position: absolute;
        border: 1px solid #000;
        user-select: none;
        >div {
          background-color: yellow;
        }
      }
    }
  }
</style>
