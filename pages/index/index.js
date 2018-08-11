// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  text:"这里是初始文字",
  userid:undefined,
  nickName:undefined,
  picUrl:undefined,
  redDot:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp()
    // console.log(app.data.nickName)
    // console.log(app.data.picUrl)
    this.data.nickName = app.data.nickName
    this.data.picUrl = app.data.picUrl
    this.data.userid = app.data.userid
    this.setData({ username: app.data.nickName, picUrl: app.data.picUrl })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.checkReceivedMail()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    
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
  //检查收件箱是否有新的未读邮件
  checkReceivedMail:function(){
    //请求收件箱，遍历，如果有未读的就加小红点
    this.setData({redDot:'../../assets/image/redDot.png'})
  }
})