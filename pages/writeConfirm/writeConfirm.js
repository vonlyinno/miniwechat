// pages/writeConfirm.js
const COMMIT_MAIL_URL = 'http://193.112.91.187/yoyou/public/index.php/index/index/commit_mail'
const GET_POSTMAN_URL = 'http://193.112.91.187/yoyou/public/index.php/index/index/get_poster'
const GET_CITY_URI = 'http://193.112.91.187/yoyou/public/index.php/index/index/get_addr'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postmanPrompt: '不达',
    postmanPic: undefined,
    user_id: undefined,
    content: undefined,
    friendName: undefined,
    sliderMin: 0,
    sliderMax: 4,
    poster_id: 2,
    cities:[],
    cityIndex:0,
    citiesRaw:undefined

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(this.data.friendName)
    //请求信息
    this.requestPostman()
    this.requestCity()
  },
  requestCity:function(){
    let that = this
    wx.request({
      url: GET_CITY_URI,
      success:function(res){
        if(res.data.errno==0){
          that.data.citiesRaw = res.data.data.address
          res.data.data.address.forEach(function(e){
            that.data.cities.push(e.address)
          })
          that.setData({cities:that.data.cities,cityIndex:0})
          that.data.cityIndex = 0
        }else{
          console.log('请求城市列表返回失败！')
        }
      },
      fail:function(res){
        console.log('请求城市列表网络失败')
      }
    })
  },
  bindCityChange:function(e){
    let curCity=e.detail.value
    this.setData({cityIndex:curCity})
    
  },
  requestPostman: function() {
    let that = this;
    wx.request({
      url: GET_POSTMAN_URL,
      success: function(res) {

        if (!res.data.errno && res.data.errno == 0) {
          let postmans = res.data.data.poster;
          that.data.postmans = postmans
          that.data.poster_id = postmans[0].poster_id

          that.setData({
            poster_id: postmans[0].poster_id,
            postmanPrompt: postmans[0].poster_desc,
            postmanPic: postmans[0].poster_url,
            sliderMin: 0,
            sliderMax: postmans.length - 1
          })
          //           that.data.poster_id = postmans[0].index
          //           that.data.postmanPrompt = postmans[0].poster_desc
          //           that.data.postmanPic = postmans[0].poster_url;
          //之后要解析并刷新信使的值以显示出来
        } else {
          console.log('请求信使返回失败')
        }
      },
      fail: function(res) {
        console.log('请求信使网络失败')
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.data.userid = getApp().data.userid || 0;
    this.data.content = getApp().data.content;
    this.data.friendName = getApp().data.friendName;

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
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

  },
  cancelBtnTap: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //确定发送
  commitMail: function() {
    if (!this.data.recvAddr || this.data.recvAddr.length == 0) {
      wx.showToast({
        title: '请写上对面的邮箱',
      })
      return;
    }
    wx.request({
      url: COMMIT_MAIL_URL,
      method: 'POST',
      data: {
        data: {
          user_id: this.data.userid,
          poster_id: this.data.poster_id || 2,
          friend_name: this.data.friendName,
          friend_addr_id: this.data.citiesRaw[this.data.cityIndex].address_id||1,
          friend_email: this.data.recvAddr,
          content: this.data.content
        }
      },
      success: function(res) {
        if (res.data) {
          if (res.data.errno == 0) {
            console.log('寄信成功')
          } else {
            console.log('寄信返回失败')
          }
        }
      },
      fail: function(res) {
        console.log('寄信网络失败')
      }
    })
  },
  //从文本框获取对方昵称值
  friendNameInput: function(e) {
    this.data.friendName = e.detail.value
  },
  //从文本框获取\收件邮箱值
  recvAddrInput: function(e) {
    this.data.recvAddr = e.detail.value
  },
  //从文本框获取真实地址值
  recvRealAddrInput: function(e) {
    this.data.recvRealAddr = e.detail.value
  },
  sliderChanging: function(e) {
    // e.data.value
    let index = e.detail.value

    let postman = this.data.postmans[index]
    this.data.poster_id = postman.poster_id
    this.setData({
      postmanPrompt: postman.poster_desc,
      postmanPic: postman.poster_url
    })
  }
})