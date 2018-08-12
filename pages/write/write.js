// pages/write/write.js
const UPLOAD_IMAGE_URL = 'http://193.112.91.187/yoyou/public/index.php/index/index/upload_image';
var helper = require('../../libs/src/index.js');
Page({
  //写信有两个界面，用navigateTo跳转
  /**
   * 页面的初始数据
   */
  data: {
    nickName: undefined,
    picUrl: undefined,
    form: {},
    blocks: [{
      'index': 0,
      'value': ''
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.nickName = getApp().data.nickName
    this.data.picUrl = getApp().data.picUrl
    this.setData({
      nickName: this.data.nickName,
      picUrl: this.data.picUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    helper.checkOrientation('checkCanvas');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var fadeOutLeft = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
    fadeOutLeft.translate3d("-100%", 0, 0).step();
    this.fadeOutLeft = fadeOutLeft;

    var fadeOutRight = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
    fadeOutRight.translate3d("100%", 0, 0).step();
    this.fadeOutRight = fadeOutRight;
  },
  handPlus: function(e) {
    // 绑定增加编辑窗    
    let _order = e.target.dataset.order;
    let _blocks = this.data.blocks;
    // 依次+1
    _blocks.map(function(n, i) {
      if (n.index >= _order) {
        _blocks[i].index += 1;
      }
    })
    _blocks.push({
      'index': _order,
      'value': ''
    });
    _blocks.sort(function(a, b) {
      return a.index - b.index;
    })
    this.setData({
      'blocks': _blocks
    })
  },
  bindContentInput: function(e) {
    // 绑定输入事件
    let _index = e.target.dataset.index;
    let _blocks = this.data.blocks;

    _blocks[_index].value = e.detail.value;
    this.setData({
      'blocks': _blocks
    })
  },
  bindTypeSelect: function(e) {
    // 输入类型
    let _type = e.target.dataset.type;
    let blocks = this.data.blocks;
    let index = e.target.dataset.index;

    if (_type == "image") {
      blocks[index].type = _type;
      this._handImageUpload(index);
    } else {
      this._handTextInput(index);
    }
  },
  handBlockUp: function(e) {
    let index = e.target.dataset.index;
    let _blocks = this.data.blocks;
    // 依次+1
    if (index == 0) return;

    _blocks[index - 1].index += 1;
    _blocks[index].index -= 1;
    _blocks.sort(function(a, b) {
      return a.index - b.index;
    })
    this.setData({
      'blocks': _blocks
    })
  },
  handBlockDown: function(e) {
    let index = e.target.dataset.index;
    let _blocks = this.data.blocks;
    if (index == _blocks.length - 1) return;

    _blocks[index + 1].index -= 1;
    _blocks[index].index += 1;
    _blocks.sort(function(a, b) {
      return a.index - b.index;
    })
    this.setData({
      'blocks': _blocks
    })
  },
  handBlockClose: function(e) {
    let index = e.target.dataset.index;
    let _blocks = this.data.blocks;
    let self = this;
    if (index == 0 && _blocks.length == 1) return;

    wx.showModal({
      title: '确定要删除此段落吗？',
      success: function(res) {
        if (res.confirm) {
          _blocks.splice(index, 1);

          // 更新排序
          _blocks.map(function(n, i) {
            n.index = i
          })
          self.setData({
            'blocks': _blocks
          })
        }
      }
    });
  },
  _handTextInput: function(index) {
    let blocks = this.data.blocks;

    blocks[index].fadeOutLeft = this.fadeOutLeft
    blocks[index].fadeOutRight = this.fadeOutRight

    this.setData({
      'blocks': blocks
    })
    setTimeout(function() {
      blocks[index].type = "text";
      this.setData({
        'blocks': blocks
      })
    }.bind(this), 250)
  },
  _handImageUpload: function(index) {
    let blocks = this.data.blocks;
    let self = this;

    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;

        
        // console.log(res.tempFiles[0])
        //self.uploadImage(tempFilePaths,index);

        helper.getBase64Image('workCanvas', res.tempFilePaths[0], function(data) {
          // console.log(data)
          // console.log('准备传图片啦啦啦啦啦啦')
          
          
          self.data.blocks[index].value = data;
          self.setData({
            'blocks': self.data.blocks
          })
        });
      }
    })
  },
  //网络有延迟，但这里不考虑用户调整图片顺序、删除图片这些事情了……
  uploadImage: function(path, index) {
    console.log(path[0])
    wx.uploadFile({
      url: UPLOAD_IMAGE_URL,
      filePath: path[0],
      name: 'file',
      success: function(res) {

        if (res.data.errno != 0) {
          console.log('上传图片返回非0，图片index：' + index + ',返回码：' + res.statusCode)
        } else {
          this.data.blocks[index].value = res.data.url;
          self.setData({
            'blocks': blocks
          })
          console.log('上传图片成功，返回url：' + res.data.url)
        }
      },
      fail: function(res) {
        console.log('上传图片网络错误')
      }
    })
  },
  formSubmit: function(e) {
    let tags = '',
      areas = this.data.form.area_id,
      contents = [];
    let form = this.data.form;
    let self = this;

    if (this.data.blocks[0].value.length < 1) {
      wx.showToast({
        title: '我们不发空邮件！',
      })
      return;
    }
    if (!this.data.friendName || this.data.friendName.length<1){
      wx.showToast({
        title: '请输入对方昵称！',
      })
      return;
    }
    // this.data.tags.map(function(n, i){
    //   if(n.actived){
    //     tags += n.id+'|';
    //   }
    // })
    // form.tags = tags.slice(0, tags.length-1);
    //改造content的传递方式，从原来的构造一个dom结构，变成传递数据
    this.data.blocks.map(function(n, i) {
      if (n.type == 'text') {
        contents.push({
          'type': n.type,
          'text': n.value
        })
      } else {
        contents.push({
          'type': n.type,
          'value': n.value
        })
      }

    })
    form.content = JSON.stringify(contents);


    getApp().data.content = form.content;
    getApp().data.friendName = this.data.friendName;
    // console.log(getApp().data.content);
    wx.navigateTo({
      url: '../writeConfirm/writeConfirm', //其实在这里传值比用全局变量好
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  friendNameInput: function(e) {
    this.data.friendName = e.detail.value;
    // console.log(e.detail.value)
  },
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})