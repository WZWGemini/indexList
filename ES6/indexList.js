;
(function (window) {
  const scrollAnimate = ($el, currentY, targetY) => {
    let needScrollTop = targetY - currentY
    let _currentY = currentY
    setTimeout(() => {
      // 一次调用滑动帧数，每次调用会不一样
      const dist = Math.ceil(needScrollTop / 10)
      _currentY += dist
      $el.scrollTo(0, _currentY)
      // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
      if (needScrollTop > 10 || needScrollTop < -10) {
        scrollAnimate($el, _currentY, targetY)
      } else {
        $el.scrollTo(0, targetY)
      }
    }, 1)
  }
  const getElmById = (id) => {
    return document.getElementById(id)
  }
  const getElmByClass = (c) => {
    return document.getElementsByClassName(c)
  }
  const setCss = ($em, css) => {
    for (var attr in css) {
      $em.style[attr] = css[attr]
    }
  }
  const removeClass = ($dom, className) => {
    if (Object.prototype.toString.call($dom) === '[object HTMLCollection]') {
      for (let index = 0; index < $dom.length; index++) {
        const element = $dom[index]
        element.classList.remove(className)
      }
    } else {
      $dom.classList.remove(className)
    }
  }
  const addClass = ($dom, className) => {
    if (Object.prototype.toString.call($dom) === '[object HTMLCollection]') {
      // 类数组
      for (let index = 0; index < $dom.length; index++) {
        const element = $dom[index]
        element.classList.add(className)
      }
    } else {
      $dom.classList.add(className)
    }
  }
  const eventListener = (type, target, fun) => {
    if (target.attachEvent) {
      target.attachEvent(type, fun)
    } else {
      target.addEventListener(type, fun)
    }
  }
  const removeListener = (type, target, fun) => {
    if (target.detachEvent) {
      target.detachEvent(type, fun)
    } else {
      target.removeEventListener(type, fun)
    }
  }
  const bindEvent = (eventType, $dom, callback) => {
    if (Object.prototype.toString.call($dom) === '[object HTMLCollection]') {
      for (let index = 0; index < $dom.length; index++) {
        const element = $dom[index]
        removeListener(eventType, element, callback)
        eventListener(eventType, element, callback)
      }
    } else {
      removeListener(eventType, $dom, callback)
      eventListener(eventType, $dom, callback)
    }
  }
  class IndexList {
    /**
     * @description: 
     * @param {object} 
     * @return: 
     */
    constructor(options, cb = function () {}) {
      /* 
        options: { // default
          search: true,
          animation: true,
          data: [] // [{title: 'a', lists: []}]
        }
        cb: function () {} // 选择触发时回调
      */
      this.options = {
        search: true,
        animation: true,
        data: [],
        ...options
      }
      this.cb = cb
      this.container = document.getElementsByTagName('body')[0]
      this.class = {
        indexBarItemActive: 'indexList-catalog-hover'
      }
      this.template = {
        indexBox: (value, bar) => {
          value = `<div id="__scroller" class="indexList-catalog">${value}</div>${bar}`
          let div = document.createElement('div')
          div.id = '__indexListBox'
          if (this.options.animation) {
            div.style['transform'] = 'translate3d(100%, 0, 0)'
          } else {
            div.style['display'] = 'none'
          }
          div.innerHTML = value
          div.classList.add('indexList-catalog-box')
          return div
        },
        search: function () {
          return `<div class="index-searchbar">
        <div class="index-searchbar_input" id="show">
          <a id="__searchGuise" class="index-searchbar_nav">
            <i class="icon-17"></i>
            <span>搜索/添加其他银行</span>
          </a>
          <div id="__searchBox" class="index-searchbar_text" style="display: none">
            <i class="icon-17"></i>
            <input class='input-text' type="text" placeholder="搜索/添加其他银行" id="__searchInput">
            <label id="__searchClose" class="icon-14"></label>
          </div>
        </div>
      </div>`
        },
        searchResult: function () {
          return `<div id="__searchResult" class="indexList-catalog-list"></div>`
        },
        searchResultItem: function (value) {
          return `<label class="indexList-catalog-row-list">${value}<a data-val="${value}" class="indexList-catalog-list-a">使用</a></label>`
        },
        searchNotFound: function (value) {
          return `<div class="indexList-catalog-row-tips">未搜索到"${value}",您可手动点击按钮使用该银行</div>`
        },
        indexBar: function (value) {
          return `<div id="__indexBar" class="indexList-catalog-link">${value}</div>`
        },
        indexBarItem: function (value) {
          let dom = ''
          if (value instanceof Array) {
            value.forEach((val, index) => {
              dom += `<a class="indexList-catalog-link-row">${val[0]}<i class="text">${val[0]}</i></a>`
            })
          } else {
            dom += `<a class="indexList-catalog-link-row">${value[0]}<i class="text">${value[0]}</i></a>`
          }
          return dom
        },
        indexItem: function (obj, index = 0) {
          if (obj.lists.length === 0) {
            throw new Error('lists.length cannot be 0')
          }
          let listDom = ''
          obj.lists.forEach((val, index) => {
            listDom += `<label data-index="${index}" class="indexList-catalog-row-list ">${val}</label>`
          })
          return `<div id="indexItem-${index}" data-index="${index}" class="indexList-catalog-list __indexItem">
          <div class="indexList-catalog-row">${obj.title}</div>
          ${listDom}
        </div>`
        }
      }
    }
    init() {
      if (Object.prototype.toString.apply(this.options.$el) === '[object HTMLDivElement]') {
        this.container = this.options.$el
      }
      this.container.style['overflow'] = 'hidden'
      this._initLayout()
      this._initEvent()
    }
    hide () {
      if (this.options.animation) {
        getElmById('__indexListBox').classList.remove('slideInRight')
        getElmById('__indexListBox').classList.add('slideOutRight')
      } else {
        getElmById('__indexListBox').style['display'] = 'none'
      }
    }
    show () {
      if (this.options.animation) {
        getElmById('__indexListBox').classList.remove('slideOutRight')
        getElmById('__indexListBox').classList.add('slideInRight')
      } else {
        getElmById('__indexListBox').style['display'] = 'block'
      }
    }
    _initLayout() {
      let dom = ''
      if (!this.options.data.length) {
        throw new Error('data.length can not be 0')
      }
      if (this.options.search) {
        dom += (this.template.search() + this.template.searchResult())
      }
      let arr = []
      this.options.data.forEach((val, index) => {
        dom += this.template.indexItem(val, index)
        arr.push(val.title)
      })
      this.container.appendChild(this.template.indexBox(dom, this.template.indexBar(this.template.indexBarItem(arr))))
    }
    _initEvent() {
      // 页面已经初始化完成
      this._scrollEvent()
      this._searchEvent()
      this._selectEvent()
    }
    _searchEvent() {
      let $searchGuise = getElmById('__searchGuise')
      let $searchBox = getElmById('__searchBox')
      let $searchInput = getElmById('__searchInput')
      let $searchClose = getElmById('__searchClose')
      let $searchResult = getElmById('__searchResult')
      let data = []
      this.options.data.forEach((val, index) => {
        data = [...data,...val.lists]
      })
      let search = (value, data) => {
        // 模糊匹配 value in data
        let result = []
        if (value !== '') {
          result = data.filter((val,index) => {
            return val.includes(value)
          })
        }
        return result
      }
      bindEvent('click', $searchGuise, function (e) {
        setCss($searchGuise, {
          display: 'none'
        })
        setCss($searchBox, {
          display: 'flex'
        })
        $searchInput.focus()
      })
      bindEvent('click', $searchClose, function (e) {
        $searchInput.value = ''
        $searchResult.innerHTML = ''
      })
      bindEvent('input', $searchInput, (e) => {
        let result = search(e.target.value, data)
        let dom = ''
        if (result.length === 0 && e.target.value !== '') {
          dom = this.template.searchResultItem(e.target.value) + this.template.searchNotFound(e.target.value)
        } else {
          result.forEach((val, index) => {
            dom += this.template.searchResultItem(val)
          })
        }
        $searchResult.innerHTML = dom
      })
    }
    _scrollEvent() {
      let $indexBar = getElmById('__indexBar')
      let $scroller = getElmById('__scroller')
      let $indexBarItem = getElmByClass('indexList-catalog-link-row')
      let scroll = (e, index) => {
        // $scroller.scrollTop += getElmById(`indexItem-${index}`).getBoundingClientRect().top
        // $scroller.scrollTo(0, $scroller.scrollTop+getElmById(`indexItem-${index}`).getBoundingClientRect().top)
        scrollAnimate($scroller, $scroller.scrollTop, $scroller.scrollTop + getElmById(`indexItem-${index}`).getBoundingClientRect().top)
      }
      let onTouch = (e) => {
        if (e.touches.length > 1) {
          return
        }
        if(e.cancelable) {
          e.preventDefault();
        }
        let $indexBarRect = $indexBar.getBoundingClientRect()
        let $indexBarItemRect = $indexBarItem[0].getBoundingClientRect()
        if (e.target.tagName.toLocaleLowerCase() === 'a') {
          removeClass($indexBarItem, this.class.indexBarItemActive)
          let index = parseInt((e.touches[0].clientY - $indexBarRect.top) / ($indexBarRect.height / this.options.data.length))
          if (index < 0) {
            index = 0
          } else if (index >= this.options.data.length) {
            index = this.options.data.length - 1
          }
          addClass($indexBarItem[index], this.class.indexBarItemActive)
          scroll(e, index)
        }
      }
      let touchEnd = () => {
        setTimeout(() => {
          removeClass($indexBarItem, this.class.indexBarItemActive)
        }, 500)
      }
      bindEvent('touchstart', $indexBar, onTouch)
      bindEvent('touchmove', $indexBar, onTouch)
      bindEvent('touchend', $indexBar, touchEnd)
    }
    _selectEvent () {
      let $indexItem = getElmByClass('__indexItem')
      let $searchResult = getElmById('__searchResult')
      bindEvent('click', $indexItem, (e) => {
        if (e.target.tagName.toLocaleLowerCase() === 'label') {
          this.hide()
          this.cb(e.target.textContent)
        }
      })
      bindEvent('click', $searchResult, (e) => {
        if (e.target.tagName.toLocaleLowerCase() === 'a') {
          this.hide()
          this.cb(e.target.dataset.val)
        }
      })
    }
  }
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return IndexList
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = IndexList
  } else {
    window.IndexList = IndexList
  }
})(window)