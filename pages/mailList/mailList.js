// pages/mailList/mailList.js
import {
  $stopWuxRefresher,
  $wuxToast
} from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    opt: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    let url
    if(options.type === 'send') {
      url = ''
    } else {
      url = ''
    }
    this.setData({
      opt: {
        url
      }
    })
    let list = await getMailList()
    if(list) {
      this.setData({
        list
      })
    }
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
  // 下拉刷新
  onPulling() {
    console.log('onPulling')
  },
  async onRefresh() {
    console.log('onRefresh')
    await this.getMailList()
    $stopWuxRefresher()
  },
  getMailList () {
    try {
      // let list = await wx.request({
      //   url: this.opt.url, //仅为示例，并非真实的接口地址
      //   data: this.opt.args
      // })
      return list
    } catch (err) {
      $wuxToast().show({
        type: 'cancel',
        duration: 1500,
        color: '#fff',
        text: '获取失败'
      })
    }
  }
})