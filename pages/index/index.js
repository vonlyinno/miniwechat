// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  text:"这里是初始文字"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let url ="http://pic.58pic.com/58pic/15/67/74/31658PIC94H_1024.jpg";
    // this.setData({src:url});
    // console.log("页面显示")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  refreshText:function(){
    console.log('按下按钮')
    //test openid
    // console.log(getApp().data.openid);
    let _this = this;
    let testUrl = 'http://193.112.91.187/manji/public/index.php/index/index/index ';
    const requestTask = wx.request({
      url: testUrl, //仅为示例，并非真实的接口地址
      data: {
     
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res)
        _this.setData({text:res.data})
      }
    })
  }
})