export default class DpPlacer {
  _containerElement = null
  _layoutElements = null
  _currentLayoutElement = null
  _moveElement = null
  _resizeElement = null
  _currentItemElement = null
  _status = null
  _mouse_status = null
  _resize_type = null
  _zIndex = 0
  _zoom = 1
  _move_direction = {
    h:'left',
    v:'top'
  }
  constructor({container, layout, item}) {
    this._containerSelector = container
    this._layoutSelector = layout
    this._itemSelector = item
    this._init()
  }
  _init = () => {
    this._containerElement = document.querySelector(this._containerSelector)
    // this._layoutElement = document.querySelector(this._layoutSelector)
    this._layoutElements = document.querySelectorAll(this._layoutSelector)
    this._containerElement.addEventListener('mousedown', this._mousedown)
    this._containerElement.addEventListener('mousemove', this._mousemove)
    document.body.addEventListener('mouseup', e => {
      this._clearStatus()
    })
    this._containerElement.addEventListener('mouseleave', e => {
        this._clearStatus()
    })
  }
  _clearStatus = () => {
    this._moveElement = null
    this._status = null
    this._mouse_status = null
    this._currentItemElement = null
    this._resize_type = null
    this._auxiliary_line_x && document.body.removeChild(this._auxiliary_line_x)
    this._auxiliary_line_x = null
    this._auxiliary_line_y && document.body.removeChild(this._auxiliary_line_y)
    this._auxiliary_line_y = null
    this._move_direction.h = 'left'
    this._move_direction.v = 'top'
  }
  _mousemove = (e) => {
    if(this._mouse_status !== 'down') {
      this._checkarea(e)
    }
    if(this._mouse_status === 'down') {
      if(this._status === 'resize') { // resize
        if(this._currentItemElement.style.cursor === 'nwse-resize') { // 变大
          let new_item_width = e.pageX - this._resizeElement.getBoundingClientRect().left + 5
          let new_item_height = e.pageY - this._resizeElement.getBoundingClientRect().top+ 5
          this._currentItemElement.style.width = new_item_width / this._zoom + 'px'
          this._currentItemElement.style.height = new_item_height / this._zoom + 'px'
          this._handleResize({ height: new_item_height, width: new_item_width})
        }
        if(this._currentItemElement.style.cursor === 'ew-resize') { // 拉宽
          let new_item_width = e.pageX - this._resizeElement.getBoundingClientRect().left + 5
          this._currentItemElement.style.width = new_item_width / this._zoom + 'px'
          this._handleResize({ height: this._resizeElement.offsetHeight, width: new_item_width})
        }
        if(this._currentItemElement.style.cursor === 'ns-resize') { // 拉高
          let new_item_height = e.pageY - this._resizeElement.getBoundingClientRect().top + 5
          this._currentItemElement.style.height = new_item_height / this._zoom + 'px'
          this._handleResize({ width: this._resizeElement.offsetWidth, height: new_item_height})
        }
      }
      if(this._status === 'move') { // move
        // layout的位置
        let layoutLeft = this._currentLayoutElement.getBoundingClientRect().left
        let layoutTop = this._currentLayoutElement.getBoundingClientRect().top
        // 鼠标在页面的位置
        let {pageX, pageY} = e
        // 鼠标在layout中的位置
        let mouse_layout_left = pageX - layoutLeft
        let mouse_layout_top = pageY - layoutTop + this._currentLayoutElement.scrollTop
        // item在layout中的位置
        let item_layout_left = mouse_layout_left - this._mouse_item_left
        let item_layout_top = mouse_layout_top - this._mouse_item_top
        let new_item_left = item_layout_left <= this._max_item_left ? (item_layout_left >=0 ? item_layout_left : 0) : this._max_item_left
        // let new_item_top = item_layout_top <= this._max_item_top ? (item_layout_top >= 0 ? item_layout_top : 0) :  this._max_item_top
        let new_item_top = item_layout_top >= 0 ? item_layout_top : 0

        if(this._moveElement.style.left.replace('px','') < new_item_left/this._zoom) { // 向右移动时
          this._move_direction.h = 'right'
        } else if(this._moveElement.style.left.replace('px','') > new_item_left/this._zoom){
          this._move_direction.h = 'left'
        }
        this._auxiliary_line_x.style.left = this._moveElement.getBoundingClientRect().left + (this._move_direction.h === 'right' ? this._moveElement.getBoundingClientRect().width : 0) + 'px'
        
        if(this._moveElement.style.top.replace('px','') < new_item_top/this._zoom) { // 向下移动时
          this._move_direction.v = 'bottom'
        } else if(this._moveElement.style.top.replace('px','') > new_item_top/this._zoom) {
          this._move_direction.v = 'top'
        }
        this._moveElement.style.left = new_item_left/this._zoom + 'px'
        this._moveElement.style.top = new_item_top/this._zoom + 'px'
        this._auxiliary_line_y.style.top = this._moveElement.getBoundingClientRect().top + (this._move_direction.v === 'bottom' ? this._moveElement.getBoundingClientRect().height : 0)+ 'px'
        this._handleDrag({
          left: new_item_left,
          top: new_item_top
        })
      }
    }
  }
  _mousedown = (e) => {
    console.log('e.pageX :>> ', e.pageX);
    switch(e.which) {
      case 1:
        console.log('左键 :>> ');
        break
      case 2:
        console.log('滚动键 :>> ');
        break
      case 3:
        console.log('右键 :>> ');
        break
    }
    if(this._is_in_item(e)) {
      this._mouse_status = 'down'
      // 判断点击的容器在哪个layout下
      const _layoutElements = this._layoutElements
      for (let i = 0; i < _layoutElements.length; i++) {
        const element = _layoutElements[i];
        const node = this._currentItemElement.parentNode
        while (!node && !node.className.includes(this._layoutSelector.substr(1))) {
          node = node.parentNode
        }
        if(element === node) {
          this._currentLayoutElement = element
        }
      }
      this._handleMousedown(e)
    }
  }
  _create_auxiliary_line = () => { // 创建辅助线
      const auxiliary_line_x = document.createElement('div')
      auxiliary_line_x.id = 'auxiliary_line_x'
      auxiliary_line_x.style.width = '1px'
      auxiliary_line_x.style.height = '100%'
      auxiliary_line_x.style.position = 'fixed'
      auxiliary_line_x.style.top = '0'
      auxiliary_line_x.style.borderRight = '1px dashed #ccc'
      document.body.appendChild(auxiliary_line_x)
      this._auxiliary_line_x = auxiliary_line_x
      const auxiliary_line_y = document.createElement('div')
      auxiliary_line_y.id = 'auxiliary_line_y'
      auxiliary_line_y.style.height = '1px'
      auxiliary_line_y.style.width = '100%'
      auxiliary_line_y.style.position = 'fixed'
      auxiliary_line_x.style.left = '0'
      auxiliary_line_y.style.borderBottom = '1px dashed #ccc'
      document.body.appendChild(auxiliary_line_y)
      this._auxiliary_line_y = auxiliary_line_y
  }
  _handleMousedown = (e) => {
    const item_rect = this._currentItemElement.getBoundingClientRect()
    this._currentItemElement.style.zIndex = ++this._zIndex
    //resize
    if(item_rect.left + item_rect.width - e.pageX <= 10 || item_rect.top + item_rect.height - e.pageY <= 10) {
      this._status = 'resize'
      this._resizeElement = this._currentItemElement
    } else { //move
      this._status = 'move'
      this._moveElement = this._currentItemElement
      this._create_auxiliary_line()
      let {pageX, pageY} = e
      // 鼠标在item上的位置
      this._mouse_item_left = pageX - item_rect.left
      this._mouse_item_top = pageY - item_rect.top
      // item的最大位置
      this._max_item_left = this._currentLayoutElement.offsetWidth - this._moveElement.offsetWidth
      // console.log('this._max_item_left :>> ', this._max_item_left);
      // this._max_item_top = this._currentLayoutElement.offsetHeight - this._moveElement.offsetHeight
    }
  }
  _is_in_item = (e) => { // 点击时是否在item中
    const itemElements = document.querySelectorAll(this._itemSelector)
    for (let i = 0; i < itemElements.length; i++) {
      const element = itemElements[i];
      if(element.contains(e.target)) {
        let layoutInItem = element.querySelector(this._layoutSelector)
        if(layoutInItem && layoutInItem !== e.target && layoutInItem.contains(e.target)) { // 判断点击时是否在这个item下的layout中
          continue
        }
        this._currentItemElement = element
        return true
      }
    }
    this._currentItemElement = null
    return false
  }
  _checkarea = (e) => { // 根据鼠标位置显示不同类型的指针
    if(this._is_in_item(e)) {
      // 鼠标的位置
      let { pageX, pageY } = e
      // item的位置
      const item_rect = this._currentItemElement.getBoundingClientRect()
      if(item_rect.left + item_rect.width - pageX <= 10 && item_rect.top + item_rect.height - pageY <= 10) {
        this._currentItemElement.style.cursor = 'nwse-resize'
        return 'nwse-resize'
      }
      if(item_rect.left + item_rect.width - pageX <= 10) {
        this._currentItemElement.style.cursor = 'ew-resize'
        return 'ew-resize'
      }
      if(item_rect.top + item_rect.height - pageY <= 10) {
        this._currentItemElement.style.cursor = 'ns-resize'
        return 'ns-resize'
      }
      this._currentItemElement.style.cursor = ''
    }
  }
  _handleDrag = () => {}
  _handleResize = () => {}
  on = (type, fn) => {
    if(type === 'drag') {
      this._handleDrag = fn
    }
    if(type === 'resize') {
      this._handleResize = fn
    }
  }
  setZoom = (zoom) => {
    this._zoom = zoom
  }
}