/*
 * @Author: tinniehe 
 * @Date: 2018-08-11 20:08:50 
 * @Last Modified by: tinniehe
 * @Last Modified time: 2018-08-11 20:32:05
 */

import { $wuxToast } from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

const GET__MAIL_URL = 'http://193.112.91.187/manji/public/index.php/index/index/get_mail'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRoutine: true,
    showBtnToRoutine: true,
    mail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    if(!options.mail_id) {
      wx.navigateBack()
      return
    }
    if(options.type === 'mail') {
      //only mail
      this.setData({
        showRoutine: false,
        showBtnToRoutine: false
      })
    }
    let opt = {
      url: GET__MAIL_URL,
      data: {
        data: {
          mail_id: options.mail_id
        }
      }
    }
    let mail = await this.requestApi(opt)
    if(mail.errno === 0) {
      this.setData({
        mail
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  showMail(){
    this.setData({
      showRoutine: false
    })
  },
  showRoutine(){
    this.setData({
      showRoutine: true
    })
  },
  async requestApi (opt) {
    try {
      let res = await wx.request(opt)
      if(res.errno !== 0){
        $wuxToast().show({
          type: 'cancel',
          duration: 1500,
          color: '#fff',
          text: '出错啦'
        })
      }
      return res
    } catch (err) {
      $wuxToast().show({
        type: 'cancel',
        duration: 1500,
        color: '#fff',
        text: '出错啦',
        success () {
          wx.navigateBack()
        }
      })
    }
  }




})