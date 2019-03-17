<template>
  <div>
    <button @click="a">+</button>
    <index-list :listData="listData" @onSelect="select" :isShow="show"></index-list>
  </div>
</template>
<script>
import IndexList from './indexList'
export default {
  data () {
    return {
      show: false,
      listData: [
          {
            title: "A",
            lists: ["中国工商银行", "中国农业银行", "中国银行", "中国建设银行"]
          },
          {
            title: "B",
            lists: [
              "浙江网商银行",
              "伊犁国民村镇银行",
              "五家渠国民村镇银行",
              "新疆绿洲国民村镇银行"
            ]
          },
          {
            title: "C",
            lists: [
              "浙江三门银座村镇银行",
              "浙商银行",
              "张家港农村商业银行",
              "吴江农村商业银行"
            ]
          },
          {
            title: "D",
            lists: [
              "无锡农村商业银行",
              "乌鲁木齐市商业银行",
              "西安银行",
              "云南红塔银行（玉溪市商业银行）"
            ]
          },
          {
            title: "E",
            lists: [
              "宜宾市商业银行",
              "自贡市商业银行",
              "珠海华润银行",
              "中原银行"
            ]
          },
          {
            title: "F",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "G",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "H",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "I",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "J",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "K",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "L",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "M",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "N",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "O",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "P",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "Q",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "R",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "S",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          },
          {
            title: "T",
            lists: ["唉唉", "袄袄", "吖", "爱爱啊"]
          }
        ]
    }
  },
  components: {
    IndexList
  },
  methods: {
    a () {
      this.show = true
    },
    select (v) {
      this.show = false
      console.log(v)
    }
  }
}
</script>
