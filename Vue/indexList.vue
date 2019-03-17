<template>
  <transition :name="animation">
  <div v-show="isShow" class="indexList-catalog-box">
    <div ref="__scroller" class="indexList-catalog">
      <!-- 搜索栏 -->
      <div class="index-searchbar">
        <div class="index-searchbar_input">
          <a
            @click="showSearch"
            v-show="!isShowSearch"
            href="javascript:void(0);"
            class="index-searchbar_nav"
          >
            <i class="icon-17"></i>
            <span>搜索/添加其他银行</span>
          </a>
          <div v-show="isShowSearch" class="index-searchbar_text">
            <i class="icon-17"></i>
            <input
              ref="__searchInput"
              class="input-text"
              type="text"
              placeholder="搜索/添加其他银行"
              v-model="searchVal"
            >
            <label @click="clearSearch" class="icon-14"></label>
          </div>
        </div>
      </div>
      <!-- 搜索栏end -->
      <!-- 收缩结果 -->
      <div class="indexList-catalog-list">
        <label v-show="searchResult.length > 0" v-for="(value, index) in searchResult" :key="index" class="indexList-catalog-row-list">
          {{value}}
          <a @click="select" :data-val="value" href="javascript:void(0);" class="indexList-catalog-list-a">使用</a>
        </label>
        <label v-show="searchResult.length === 0 && searchVal !==''" class="indexList-catalog-row-list">
          {{searchVal}}
          <a @click="select" :data-val="searchVal" href="javascript:void(0);" class="indexList-catalog-list-a">使用</a>
        </label>
        <div v-show="searchResult.length === 0 && searchVal !==''" class="indexList-catalog-row-tips">未搜索到"{{searchVal}}",您可手动点击按钮使用该银行</div>
      </div>
      <!-- 收缩结果end -->
      <div
        :ref="'__indexItem-'+index"
        v-for="(item, index) in listData"
        :key="index"
        class="indexList-catalog-list"
      >
        <div class="indexList-catalog-row">{{item.title[0].toLocaleUpperCase()}}</div>
        <label @click="select" :data-val="val" v-for="(val, i) in item.lists" :key="i" class="indexList-catalog-row-list">{{val}}</label>
      </div>
    </div>
    <div
      ref="__indexBar"
      @touchmove="onTouch"
      @touchend="touchEnd"
      @touchstart="onTouch"
      class="indexList-catalog-link"
    >
      <a
        v-for="(item, index) in listData"
        :key="index"
        href="javascript:void(0);"
        :class="['indexList-catalog-link-row',{
          'indexList-catalog-hover': indexBarItemActive === `indexBarItem-${index}`
        }]"
      >
        <i class="text">{{item.title[0].toLocaleUpperCase()}}</i>
        {{item.title[0].toLocaleUpperCase()}}
      </a>
    </div>
  </div>
  </transition>
</template>
<script>
const scrollAnimate = ($el, currentY, targetY) => {
  let needScrollTop = targetY - currentY;
  let _currentY = currentY;
  setTimeout(() => {
    // 一次调用滑动帧数，每次调用会不一样
    const dist = Math.ceil(needScrollTop / 10);
    _currentY += dist;
    $el.scrollTo(0, _currentY);
    // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
    if (needScrollTop > 10 || needScrollTop < -10) {
      scrollAnimate($el, _currentY, targetY);
    } else {
      $el.scrollTo(0, targetY);
    }
  }, 1);
};
const search = (value, data) => {
  // 模糊匹配 value in data
  let result = [];
  if (value !== "") {
    result = data.filter((val, index) => {
      return val.includes(value);
    });
  }
  return result;
};
export default {
  data() {
    return {
      isShowSearch: false,
      indexBarItemActive: "",
      searchVal: "",
      searchResult: []
    };
  },
  computed: {
    allItem() {
      let arr = [];
      this.listData.forEach((val, index) => {
        arr = [...arr, ...val.lists];
      });
      return arr;
    }
  },
  watch: {
    searchVal: function(newVal, oldVal) {
      if (newVal === "") {
        this.searchResult = [];
      } else {
        this.searchResult = search(newVal, this.allItem);
      }
    }
  },
  props: {
    listData: {
      type: Array,
      default: function() {
        return []
      }
    },
    animation: {
      type: String,
      default: 'slideInRight'
    },
    isShow: {
      type: Boolean,
      defualut: false
    }
  },
  methods: {
    showSearch() {
      this.isShowSearch = true;
      this.$refs.__searchInput.focus();
    },
    onTouch(e) {
      if (e.touches.length > 1) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
      let $scroller = this.$refs.__scroller;
      let $indexBarRect = this.$refs.__indexBar.getBoundingClientRect();
      let $indexBarItemRect = this.$refs.__indexBar.children[0].getBoundingClientRect();
      if (e.target.tagName.toLocaleLowerCase() === "a") {
        let index = parseInt(
          (e.touches[0].clientY - $indexBarRect.top) /
            ($indexBarRect.height / this.listData.length)
        );
        if (index < 0) {
          index = 0;
        } else if (index >= this.listData.length) {
          index = this.listData.length - 1;
        }
        this.indexBarItemActive = `indexBarItem-${index}`;
        scrollAnimate(
          $scroller,
          $scroller.scrollTop,
          $scroller.scrollTop +
            this.$refs["__indexItem-" + index][0].getBoundingClientRect().top
        );
      }
    },
    touchEnd() {
      setTimeout(() => {
        this.indexBarItemActive = "";
      }, 500);
    },
    clearSearch () {
      this.searchVal = ''
    },
    select (e) {
      this.searchVal = ''
      this.searchResult = []
      this.$emit('onSelect', e.target.dataset.val)
    }
  }
};
</script>
<style scoped>
@import url("./reset.css");
@import url("./indexList.css");
</style>

