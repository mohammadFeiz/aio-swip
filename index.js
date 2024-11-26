"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _aioGeo = _interopRequireDefault(require("./../../npm/aio-geo"));
var _aioUtils = require("../aio-utils");
var _jquery = _interopRequireDefault(require("jquery"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class Swip {
  constructor(p) {
    _defineProperty(this, "p", void 0);
    _defineProperty(this, "geo", void 0);
    _defineProperty(this, "timeout", void 0);
    _defineProperty(this, "count", void 0);
    _defineProperty(this, "domLimit", void 0);
    _defineProperty(this, "parentLimit", void 0);
    _defineProperty(this, "getDom", void 0);
    _defineProperty(this, "getParent", void 0);
    _defineProperty(this, "init", void 0);
    _defineProperty(this, "dx", void 0);
    _defineProperty(this, "dy", void 0);
    _defineProperty(this, "cx", void 0);
    _defineProperty(this, "cy", void 0);
    _defineProperty(this, "dist", void 0);
    _defineProperty(this, "so", void 0);
    _defineProperty(this, "getPercentByValue", void 0);
    _defineProperty(this, "getMousePosition", void 0);
    _defineProperty(this, "click", void 0);
    _defineProperty(this, "mouseDown", void 0);
    _defineProperty(this, "mouseMove", void 0);
    _defineProperty(this, "mouseUp", void 0);
    _defineProperty(this, "getDOMLimit", void 0);
    _defineProperty(this, "change", void 0);
    _defineProperty(this, "getPage", void 0);
    _defineProperty(this, "isMoving", void 0);
    _defineProperty(this, "centerAngle", void 0);
    _defineProperty(this, "defaultLimit", void 0);
    _defineProperty(this, "addSelectRect", void 0);
    _defineProperty(this, "setSelectRect", void 0);
    _defineProperty(this, "removeSelectRect", void 0);
    _defineProperty(this, "selectRect", void 0);
    _defineProperty(this, "getIsInSelectRect", void 0);
    _defineProperty(this, "defaultChange", void 0);
    let {
      selectRect
    } = p;
    if (selectRect) {
      let {
        color = '#96a9bc'
      } = selectRect;
      this.selectRect = {
        ...selectRect,
        color
      };
    }
    this.defaultChange = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      dist: 0,
      angle: 0,
      deltaCenterAngle: 0
    };
    this.defaultLimit = {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      centerX: 0,
      centerY: 0
    };
    this.domLimit = this.defaultLimit;
    this.parentLimit = this.defaultLimit;
    this.change = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      dist: 0,
      angle: 0,
      deltaCenterAngle: 0
    };
    this.addSelectRect = () => {};
    this.setSelectRect = () => {};
    this.removeSelectRect = () => {};
    this.so = {};
    this.p = p;
    this.geo = new _aioGeo.default();
    this.timeout = undefined;
    this.count = 0;
    this.getDom = () => p.dom();
    this.getParent = () => p.parent ? p.parent() : undefined;
    this.dx = 0;
    this.dy = 0;
    this.cx = 0;
    this.cy = 0;
    this.dist = 0;
    this.isMoving = false;
    this.centerAngle = 0;
    this.init = () => {
      this.count++;
      if (this.count > 10) {
        clearTimeout(this.timeout);
        return;
      }
      let res = this.getDom();
      if (!res.length) {
        this.timeout = setTimeout(() => this.init(), 400);
      } else {
        clearTimeout(this.timeout);
        (0, _aioUtils.EventHandler)(this.getDom(), 'mousedown', _jquery.default.proxy(this.mouseDown, this));
        if (p.onClick) {
          (0, _aioUtils.EventHandler)(this.getDom(), 'click', _jquery.default.proxy(this.click, this));
        }
      }
    };
    this.getPercentByValue = (value, start, end) => {
      return 100 * (value - start) / (end - start);
    };
    this.getPage = () => {
      let {
        page
      } = this.p;
      return page ? page() : (0, _jquery.default)(window);
    };
    this.getMousePosition = e => {
      this.domLimit = this.getDOMLimit('dom');
      let page = this.getPage();
      let st = page.scrollTop();
      let sl = page.scrollLeft();
      let client = (0, _aioUtils.GetClient)(e),
        x = client.x - this.domLimit.left + sl,
        y = client.y - this.domLimit.top + st;
      let xp = this.getPercentByValue(x, 0, this.domLimit.width),
        yp = this.getPercentByValue(y, 0, this.domLimit.height);
      let centerAngle = this.geo.getAngle([[this.domLimit.centerX, this.domLimit.centerY], [client.x, client.y]]);
      let res = {
        xp,
        yp,
        clientX: client.x,
        clientY: client.y,
        x,
        y,
        centerAngle
      };
      return res;
    };
    this.getDOMLimit = type => {
      let dom = type === 'dom' ? this.getDom() : this.getParent();
      let offset = dom.offset();
      let DOM = {
        width: dom.width(),
        height: dom.height(),
        left: offset.left,
        top: offset.top,
        centerX: 0,
        centerY: 0
      };
      return {
        ...DOM,
        centerX: DOM.left + DOM.width / 2,
        centerY: DOM.top + DOM.height / 2,
        right: DOM.left + DOM.width,
        bottom: DOM.top + DOM.height
      };
    };
    this.click = e => {
      //jeloye click bad az drag ro bayad begirim choon click call mishe 
      if (this.isMoving) {
        return;
      }
      this.domLimit = this.getDOMLimit('dom');
      this.parentLimit = p.parent ? this.getDOMLimit('parent') : this.defaultLimit;
      let mousePosition = this.getMousePosition(e);
      let clickParams = {
        mousePosition,
        domLimit: this.domLimit,
        parentLimit: this.parentLimit,
        event: e,
        change: this.defaultChange
      };
      if (p.onClick) {
        p.onClick(clickParams);
      }
    };
    this.addSelectRect = (left, top) => {
      if (!this.selectRect || !this.selectRect.enable()) {
        return;
      }
      let {
        color
      } = this.selectRect;
      let dom = this.getDom();
      this.so.tsr = {
        left,
        top
      };
      this.removeSelectRect();
      dom.append(`<div class="swip-select-rect" style="border:1px dashed ${color};background:${color + '30'};left:${left}px;top:${top}px;position:absolute;width:0;height:0"></div>`);
    };
    this.setSelectRect = (width, height) => {
      if (!this.selectRect || !this.selectRect.enable()) {
        return;
      }
      let dom = this.getDom();
      let SR = dom.find('.swip-select-rect');
      let {
        tsr = {
          left: 0,
          top: 0
        }
      } = this.so || {};
      let left = tsr.left;
      let top = tsr.top;
      if (width < 0) {
        left = left + width;
        width = Math.abs(width);
      }
      if (height < 0) {
        top = top + height;
        height = Math.abs(height);
      }
      let newSelectRect = {
        left,
        top,
        width,
        height
      };
      this.so.sr = newSelectRect;
      SR.css(newSelectRect);
    };
    this.removeSelectRect = () => {
      if (!this.selectRect || !this.selectRect.enable()) {
        return;
      }
      let dom = this.getDom();
      let selectRect = dom.find('.swip-select-rect');
      selectRect.remove();
    };
    this.mouseDown = e => {
      e.stopPropagation();
      this.isMoving = false;
      this.domLimit = this.getDOMLimit('dom');
      this.parentLimit = p.parent ? this.getDOMLimit('parent') : this.defaultLimit;
      let mousePosition = this.getMousePosition(e);
      this.centerAngle = mousePosition.centerAngle;
      this.cx = mousePosition.clientX;
      this.cy = mousePosition.clientY;
      this.so = {
        client: {
          x: mousePosition.clientX,
          y: mousePosition.clientY
        }
      };
      this.addSelectRect(mousePosition.x, mousePosition.y);
      let startParams = {
        mousePosition,
        domLimit: this.domLimit,
        parentLimit: this.parentLimit,
        event: e,
        change: this.defaultChange
      };
      let res = (p.start || (() => [0, 0]))(startParams);
      if (!Array.isArray(res)) {
        return;
      }
      let x = res[0],
        y = res[1];
      this.so = {
        ...this.so,
        x,
        y
      };
      (0, _aioUtils.EventHandler)('window', 'mousemove', _jquery.default.proxy(this.mouseMove, this));
      (0, _aioUtils.EventHandler)('window', 'mouseup', _jquery.default.proxy(this.mouseUp, this));
    };
    this.mouseMove = e => {
      e.stopPropagation();
      let {
        speedX = 1,
        speedY = 1,
        stepX = 1,
        stepY = 1,
        reverseX,
        reverseY,
        insideX,
        insideY
      } = this.p;
      let mousePosition = this.getMousePosition(e),
        client = (0, _aioUtils.GetClient)(e);
      let dx = client.x - this.cx,
        dy = client.y - this.cy;
      dx = Math.round(dx * speedX) * (reverseX ? -1 : 1);
      dy = Math.round(dy * speedY) * (reverseY ? -1 : 1);
      let deltaCenterAngle = mousePosition.centerAngle - this.centerAngle;
      //if(deltaCenterAngle < 0){deltaCenterAngle += 360}
      if (typeof stepX === 'number') {
        dx = Math.round(dx / stepX) * stepX;
      }
      if (typeof stepY === 'number') {
        dy = Math.round(dy / stepY) * stepY;
      }
      if (dx === this.dx && dy === this.dy) {
        return;
      }
      this.isMoving = true;
      this.dx = dx;
      this.dy = dy;
      this.dist = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
      let angle = this.geo.getAngle([[this.cx, this.cy], [client.x, client.y]]);
      this.setSelectRect(dx, dy);
      let x = 0,
        y = 0;
      if (this.so.x !== undefined && this.so.y !== undefined) {
        x = this.so.x + dx;
        y = this.so.y + dy;
        let {
          minX,
          minY,
          maxX,
          maxY
        } = this.p;
        if (minX !== undefined && x < minX) {
          x = minX;
        }
        if (maxX !== undefined && x > maxX) {
          x = maxX;
        }
        if (minY !== undefined && y < minY) {
          y = minY;
        }
        if (maxY !== undefined && y > maxY) {
          y = maxY;
        }
      }
      if (stepX === true) {
        x = Math.round(x / this.domLimit.width) * this.domLimit.width;
      }
      if (stepY === true) {
        y = Math.round(y / this.domLimit.height) * this.domLimit.height;
      }
      if (insideX) {
        if (this.parentLimit) {
          if (x > this.parentLimit.width - this.domLimit.width) {
            x = this.parentLimit.width - this.domLimit.width;
          }
          if (x < 0) {
            x = 0;
          }
        } else {
          alert('Swip error => you set insideX prop but missing parent props');
        }
      }
      if (insideY) {
        if (this.parentLimit) {
          if (y > this.parentLimit.height - this.domLimit.height) {
            y = this.parentLimit.height - this.domLimit.height;
          }
          if (y < 0) {
            y = 0;
          }
        } else {
          alert('Swip error => you set insideY prop but missing parent props');
        }
      }
      this.change = {
        x,
        y,
        dx,
        dy,
        dist: this.dist,
        angle,
        deltaCenterAngle
      };
      let p = {
        change: this.change,
        mousePosition,
        domLimit: this.domLimit,
        parentLimit: this.parentLimit,
        event: e,
        selectRect: this.so.sr,
        isInSelectRect: this.getIsInSelectRect(this.so.sr || {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        })
      };
      if (this.p.move) {
        this.p.move(p);
      }
    };
    this.getIsInSelectRect = selectRect => {
      let {
        left,
        top,
        width,
        height
      } = selectRect;
      return (x, y) => {
        if (x < left) {
          return false;
        }
        if (y < top) {
          return false;
        }
        if (x > left + width) {
          return false;
        }
        if (y > top + height) {
          return false;
        }
        return true;
      };
    };
    this.mouseUp = e => {
      e.stopPropagation();
      (0, _aioUtils.EventHandler)('window', 'mousemove', this.mouseMove, 'unbind');
      (0, _aioUtils.EventHandler)('window', 'mouseup', this.mouseUp, 'unbind');
      //chon click bad az mouseUp call mishe mouseUp isMoving ro zoodtar false mikone (pas nemitoone jeloye click bad az harekat ro begire), pas bayad in amal ba yek vaghfe anjam beshe
      //jeloye clicke bad az harekat ro migirim ta bad az drag kardan function click call nashe
      setTimeout(() => this.isMoving = false, 10);
      let mousePosition = this.getMousePosition(e);
      this.removeSelectRect();
      let p = {
        change: this.change,
        event: e,
        domLimit: this.domLimit,
        parentLimit: this.parentLimit,
        mousePosition,
        selectRect: this.so.sr,
        isInSelectRect: this.getIsInSelectRect(this.so.sr || {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        })
      };
      if (this.p.end) {
        this.p.end(p);
      }
    };
    this.init();
  }
}
exports.default = Swip;