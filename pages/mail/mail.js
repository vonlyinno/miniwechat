/*
 * @Author: tinniehe 
 * @Date: 2018-08-11 20:08:50 
 * @Last Modified by: tinniehe
 * @Last Modified time: 2018-08-13 21:34:25
 */

import {
  $wuxToast
} from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

const GET_MAIL_URL = 'http://193.112.91.187/yoyou/public/index.php/index/index/get_receive_mail'
const GET_SEND_MAIL_URL = 'http://193.112.91.187/yoyou/public/index.php/index/index/get_send_mail'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRoutine: false,
    showMail: false,
    showBtnToRoutine: false,
    spinning: true,
    mail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   * mail_id 必须
   * type= send or 空  -> 发/收
   * 发件：arrived 0寄送中 1收到
   */
  async onLoad(options) {
    if (!options.mail_id) {
      wx.navigateBack()
      return
    }
    // request option
    let opt
    if (options.type === 'send') {
      opt = {
        url: GET_SEND_MAIL_URL,
        data: {
          data: {
            mail_id: +options.mail_id
          }
        }
      }
      
    } else {
      opt = {
        url: GET_MAIL_URL,
        data: {
          data: {
            mail_id: +options.mail_id
          }
        }
      }
    }
    //send request
    let mail = await this.requestApi(opt)

    if (mail.errno === 0) {
      mail = mail.data
      let mood
      if(mail.time_line) {
        mood = mail.time_line.filter((item) => {
          return item.mood !== ''
        })
        mail.mood_count = mood.length
      }
      // time
      let time_diff = mail.arrive_time - mail.create_time
      mail.time_diff = this.calcTimediff(time_diff * 1000)
      let date1 = new Date(mail.create_time * 1000)
      let date2 = new Date(mail.arrive_time * 1000)
      mail.create_time = date1.format('yyyy.MM.dd')
      mail.arrive_time = date2.format('yyyy.MM.dd')
      //content
      mail.content = JSON.parse(mail.content)
      this.setData({
        mail: mail
      })
      if (options.type === 'send' && +options.arrived === 0) {
          this.setData({
            showMail: true
          })
      } else {
          //arrive 
          this.setData({
            showRoutine: true
          })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showMail() {
    this.setData({
      showMail: true,
      showBtnToRoutine: true,
      showRoutine: false
    })
  },
  showRoutine() {
    this.setData({
      showMail: false,
      showBtnToRoutine: false,
      showRoutine: true
    })
  },
  requestApi(opt) {
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        ...opt,
        success(data) {
          let res = data.data
          if (res.errno !== 0) {
            $wuxToast().show({
              type: 'cancel',
              duration: 1500,
              color: '#fff',
              text: '出错啦'
            })
          }
          resolve(res)         
        },
        fail() {
            $wuxToast().show({
              type: 'cancel',
              duration: 1500,
              color: '#fff',
              text: '出错啦',
              success() {
                 wx.navigateBack()
              }
            })
        }
      })
    })

  },
  calcTimediff(time) {
    //计算出相差天数
    let days = Math.floor(time / (24 * 3600 * 1000))
    //计算出小时数
    let leave1 = time % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
    let seconds = Math.round(leave3 / 1000)
    return days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒"
  }




})